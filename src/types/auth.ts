import { ReactElement } from 'react';

// ==============================|| AUTH TYPES  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
};

export type AuthInfo = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: number;
  authTimestamp: number;
};

export type UserInfo = {
  dashboardId: string;
};

export type IdpProvider = {
  institutionName: string;
  tag: string;
  entityId: string;
  domains: string[];
};
