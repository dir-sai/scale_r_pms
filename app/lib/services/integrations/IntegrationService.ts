import { ApiError } from '../errors/ApiError';

export interface IntegrationConfig {
  apiKey: string;
  apiSecret?: string;
  environment: 'sandbox' | 'production';
  baseUrl?: string;
  webhookSecret?: string;
}

export abstract class IntegrationService {
  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  protected async handleRequest<T>(
    request: Promise<T>,
    errorMessage: string = 'Integration request failed'
  ): Promise<T> {
    try {
      return await request;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw new ApiError(errorMessage, error as Error);
    }
  }

  abstract initialize(): Promise<void>;
  abstract validateConfig(): boolean;
} 