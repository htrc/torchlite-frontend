import redis from 'lib/redis';
import { AuthInfo, UserInfo } from 'types/auth';

export async function getSessionAuthInfo(sessionId: string): Promise<AuthInfo> {
  const sessionStr = await redis.get(`sessions:${sessionId}`);
  if (sessionStr) return JSON.parse(sessionStr!);
  else throw new Error(`No session info found in the database for ${sessionId}`);
}

export async function setSessionAuthInfo(sessionId: string, authInfo: AuthInfo) {
  await redis.set(`sessions:${sessionId}`, JSON.stringify(authInfo));
}

export async function setSessionExpiration(sessionId: string, expiresAtMs: number) {
  await redis.pexpireat(`sessions:${sessionId}`, expiresAtMs);
}

export async function deleteSession(sessionId: string) {
  await redis.del(`sessions:${sessionId}`);
}

export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  const userInfoStr = await redis.get(`users:${userId}`);
  if (userInfoStr) return JSON.parse(userInfoStr!);
  else return null;
}

export async function setUserInfo(userId: string, userInfo: UserInfo) {
  await redis.set(`users:${userId}`, JSON.stringify(userInfo));
}
