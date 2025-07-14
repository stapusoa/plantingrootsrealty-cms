import type { User } from '@auth0/auth0-react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
  error: Error | undefined;
}

export interface AuthActions {
  login: () => Promise<void>;
  logout: (options?: { returnTo?: string }) => Promise<void>;
  getAccessToken: () => Promise<string | undefined>;
}

export interface AuthService extends AuthState, AuthActions {}

export interface AuthConfig {
  domain: string;
  clientId: string;
  audience?: string;
  configured?: boolean;
}

export interface AuthStatus {
  configured: boolean;
  domain: string;
  clientId: string;
  message: string;
}