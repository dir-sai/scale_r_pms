export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>

  constructor(errors: Record<string, string[]>) {
    super('Validation Error', 400)
    this.errors = errors
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      errors: error instanceof ValidationError ? error.errors : undefined
    }
  }

  console.error('Unhandled error:', error)
  
  return {
    message: 'Internal server error',
    statusCode: 500
  }
}

export function handleValidationError(error: unknown) {
  if (error instanceof ValidationError) {
    return {
      success: false,
      errors: error.errors
    }
  }

  return {
    success: false,
    errors: {
      _form: ['An unexpected error occurred']
    }
  }
}

export function createErrorResponse(error: unknown) {
  const { message, statusCode, errors } = handleError(error)
  
  return new Response(
    JSON.stringify({
      error: message,
      ...(errors && { errors })
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export function handleApiError(error: unknown) {
  if (error instanceof Response) {
    return error
  }
  
  return createErrorResponse(error)
}

export function assertError(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new AppError(message, 400)
  }
}

export function assertAuthenticated(condition: unknown): asserts condition {
  if (!condition) {
    throw new AuthenticationError()
  }
}

export function assertAuthorized(condition: unknown): asserts condition {
  if (!condition) {
    throw new AuthorizationError()
  }
}

export function assertFound(condition: unknown, resource?: string): asserts condition {
  if (!condition) {
    throw new NotFoundError(resource)
  }
} 