import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';
import axios, { AxiosError } from 'axios';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import redis from 'lib/redis';
import { AuthInfo } from 'types/auth';
import { v4 as uuidv4 } from 'uuid';
import { deleteSession, getSessionAuthInfo, setSessionAuthInfo, setSessionExpiration } from 'utils/database';

const keycloak = KeycloakProvider({
  clientId: process.env.KEYCLOAK_CLIENT_ID || '',
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  issuer: process.env.KEYCLOAK_ISSUER_BASE_URL
});

async function doFinalSignoutHandshake(token: JWT) {
  if (token.provider == keycloak.id) {
    try {
      const authInfo: AuthInfo = await getSessionAuthInfo(token.sessionId);
      await redis.del(`sessions:${token.sessionId}`);
      await axios.get(`${keycloak.options!.issuer}/protocol/openid-connect/logout`, { params: { id_token_hint: authInfo.idToken } });
    } catch (e: any) {
      console.debug('Unable to perform post-logout handshake', (e as AxiosError)?.code || e);
    }
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const now = Math.floor(Date.now() / 1000);

  try {
    let authInfo: AuthInfo = await getSessionAuthInfo(token.sessionId);

    if (now > authInfo.refreshTokenExpires) throw new Error('refreshAccessToken: Refresh token is expired!');

    console.debug('Refreshing expired access token...');

    const params = new URLSearchParams({
      client_id: keycloak.options!.clientId,
      client_secret: keycloak.options!.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: authInfo.refreshToken
    });

    const response = await axios.post(`${keycloak.options!.issuer}/protocol/openid-connect/token`, params.toString()).catch((error) => {
      throw new Error(`refreshAccessToken error [${error.response.data.error}]: ${error.response.data.error_description}`);
    });

    const refreshedTokens = response.data;

    authInfo.idToken = refreshedTokens.id_token;
    authInfo.accessToken = refreshedTokens.access_token;
    authInfo.refreshToken = refreshedTokens.refresh_token;
    authInfo.refreshTokenExpires = now + refreshedTokens.refresh_expires_in;

    await setSessionAuthInfo(token.sessionId, authInfo);

    return {
      ...token,
      accessTokenExpires: now + refreshedTokens.expires_in
    };
  } catch (error) {
    console.debug(error);

    await deleteSession(token.sessionId);

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

function isExpiredAccessToken(token: JWT): boolean {
  const now = Math.floor(Date.now() / 1000);
  const expires = token.accessTokenExpires;

  console.debug(`    now: ${now}`);
  console.debug(`expires: ${expires}`);

  return now > expires;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [keycloak],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const sessionId = uuidv4();
        const decodedAccessToken = jwt_decode<JwtPayload>(account.access_token!);
        const decodedRefreshToken = jwt_decode<JwtPayload>(account.refresh_token!);

        const authInfo: AuthInfo = {
          idToken: account.id_token!,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          refreshTokenExpires: decodedRefreshToken.exp!,
          authTimestamp: Math.floor(Date.now() / 1000)
        };

        token.sessionId = sessionId;
        token.provider = account.provider;
        token.accessTokenExpires = decodedAccessToken.exp!;

        await setSessionAuthInfo(sessionId, authInfo);

        console.debug('Created new session', sessionId);

        return token;
      }

      if (isExpiredAccessToken(token)) token = await refreshAccessToken(token);

      return token;
    },
    async session({ session, token }) {
      session.sessionId = token.sessionId;

      if (session?.expires) {
        await setSessionExpiration(session.sessionId, new Date(session.expires).getTime());
      }

      if (token?.error) {
        session.error = token.error;
      }

      return session;
    }
  },
  events: {
    signOut: ({ token }) => doFinalSignoutHandshake(token)
  }
};

export default NextAuth(authOptions);
