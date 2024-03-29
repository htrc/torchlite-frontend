import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    htrcId?: string;
  }

  interface Session extends DefaultSession {
    sessionId: string;
    user: User;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider: string;
    accessTokenExpires: number;
    sessionId: string;
    error?: 'RefreshAccessTokenError';
  }
}
