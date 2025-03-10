import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../../config/api';

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !(originalRequest as any)._retry
        ) {
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken();
          }

          try {
            const newToken = await this.refreshPromise;
            (originalRequest as any)._retry = true;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, redirect to login
            await this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.refreshPromise = null;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const response = await this.client.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);

      return token;
    } catch (error) {
      await this.handleAuthError();
      throw error;
    }
  }

  private async handleAuthError() {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userData');
    // Note: We can't use router.replace here because this is outside React context
    // The auth context will handle the redirect when it detects the token is gone
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = ApiClient.getInstance().getClient(); 