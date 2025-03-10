declare module 'expo-auth-session' {
  export interface AuthSessionResult {
    type: 'success' | 'error' | 'dismiss';
    errorCode?: string;
    params?: {
      [key: string]: string;
    };
  }

  export interface DiscoveryDocument {
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    revocationEndpoint?: string;
    endSessionEndpoint?: string;
    userInfoEndpoint?: string;
    jwksUri?: string;
  }

  export interface AuthRequestConfig {
    clientId: string;
    scopes?: string[];
    redirectUri?: string;
    prompt?: string;
    responseType?: string;
    state?: string;
  }

  export class AuthRequest {
    constructor(config: AuthRequestConfig);
    promptAsync(options?: { useProxy?: boolean }): Promise<AuthSessionResult>;
  }

  export function makeRedirectUri(options?: {
    path?: string;
    native?: string;
    useProxy?: boolean;
  }): string;
} 