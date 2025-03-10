import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User, AuthState, LoginCredentials, RegisterData, ResetPasswordData, ROLE_PERMISSIONS } from '../../types/auth';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../../lib/api/auth';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!state.isLoading && !state.user && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace('/sign-in');
    } else if (state.user && inAuthGroup) {
      // Redirect to home if authenticated
      router.replace('/');
    }
  }, [state.user, state.isLoading, segments]);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');
      
      if (token && userData) {
        setState({
          user: JSON.parse(userData),
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to restore authentication state',
      });
    }
  };

  const handleAuthSuccess = async (response: { user: User; token: string; refreshToken: string }) => {
    await SecureStore.setItemAsync('userToken', response.token);
    await SecureStore.setItemAsync('refreshToken', response.refreshToken);
    await SecureStore.setItemAsync('userData', JSON.stringify(response.user));
    
    setState({
      user: response.user,
      isLoading: false,
      error: null,
    });
    
    router.replace('/');
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.login(credentials);
      await handleAuthSuccess(response);
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.register(data);
      await handleAuthSuccess(response);
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userData');
      
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
      
      router.replace('/sign-in');
    } catch (error) {
      setState({
        ...state,
        error: 'Failed to sign out',
      });
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      await AuthService.resetPassword(data);
      setState({ ...state, isLoading: false });
      router.replace('/sign-in');
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      });
    }
  };

  const googleSignIn = async () => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.googleSignIn();
      await handleAuthSuccess(response);
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google sign in failed',
      });
    }
  };

  const facebookSignIn = async () => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.facebookSignIn();
      await handleAuthSuccess(response);
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Facebook sign in failed',
      });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    
    const userRole = state.user.role;
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    googleSignIn,
    facebookSignIn,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 