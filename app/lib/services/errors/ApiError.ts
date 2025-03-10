export class ApiError extends Error {
  public originalError?: Error;
  public statusCode: number;

  constructor(message: string, originalError?: Error, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
    this.statusCode = statusCode;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack,
      } : undefined,
    };
  }
} 