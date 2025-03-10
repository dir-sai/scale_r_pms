import { apiClient } from './client';
import { API_CONFIG } from '../../config/api';
import {
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
  AuthError,
} from '../../types/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { AxiosError } from 'axios';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export class AuthService {
  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      throw new AuthError(message, error.response?.status);
    }
    throw new AuthError('An unexpected error occurred');
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async googleSignIn(): Promise<AuthResponse> {
    try {
      const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: API_CONFIG.SOCIAL_AUTH.GOOGLE.CLIENT_ID,
        responseType: ResponseType.Token,
        scopes: API_CONFIG.SOCIAL_AUTH.GOOGLE.SCOPES,
      });

      if (response?.type === 'success') {
        const { access_token } = response.params;
        const authResponse = await apiClient.post<AuthResponse>(
          API_CONFIG.ENDPOINTS.AUTH.SOCIAL_AUTH.GOOGLE,
          { token: access_token }
        );
        return authResponse.data;
      }

      throw new AuthError('Google sign in was cancelled or failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async facebookSignIn(): Promise<AuthResponse> {
    try {
      const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: API_CONFIG.SOCIAL_AUTH.FACEBOOK.APP_ID,
        responseType: ResponseType.Token,
        scopes: API_CONFIG.SOCIAL_AUTH.FACEBOOK.SCOPES,
      });

      if (response?.type === 'success') {
        const { access_token } = response.params;
        const authResponse = await apiClient.post<AuthResponse>(
          API_CONFIG.ENDPOINTS.AUTH.SOCIAL_AUTH.FACEBOOK,
          { token: access_token }
        );
        return authResponse.data;
      }

      throw new AuthError('Facebook sign in was cancelled or failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(
        API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 