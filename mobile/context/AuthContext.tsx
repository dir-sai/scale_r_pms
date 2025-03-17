import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import Config from '../constants/Config';
import AuthConfig from '../constants/AuthConfig';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: any;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: AuthConfig.GOOGLE_CLIENT_ID,
    iosClientId: AuthConfig.GOOGLE_CLIENT_ID,
    androidClientId: AuthConfig.GOOGLE_CLIENT_ID,
    webClientId: AuthConfig.GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'scale-r-pms',
      path: 'auth'
    }),
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleSignInResponse(authentication?.accessToken);
    }
  }, [response]);

  const loadUser = async () => {
    try {
      const userString = await SecureStore.getItemAsync(Config.AUTH_PERSIST_KEY);
      if (userString) {
        setUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInResponse = async (token: string | undefined) => {
    if (!token) return;

    try {
      const response = await fetch(`${AuthConfig.AUTH_URL}/callback/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          token,
          secret: AuthConfig.AUTH_SECRET
        }),
      });

      const data = await response.json();
      
      if (data.user) {
        await SecureStore.setItemAsync(Config.AUTH_PERSIST_KEY, JSON.stringify(data.user));
        await SecureStore.setItemAsync(Config.TOKEN_PERSIST_KEY, data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error initiating sign in:', error);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(Config.AUTH_PERSIST_KEY);
      await SecureStore.deleteItemAsync(Config.TOKEN_PERSIST_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
} 