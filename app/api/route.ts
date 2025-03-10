import { NextResponse } from 'next/server'
import { createErrorResponse } from '@/lib/utils/error-handler'
import { ZodError } from 'zod'

export async function GET() {
  return NextResponse.json({
    name: 'Scale-R PMS API',
    version: '1.0.0',
    status: 'healthy'
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  })
}

export function withErrorHandler(handler: Function) {
  return async function (...args: any[]) {
    try {
      return await handler(...args)
    } catch (error) {
      if (error instanceof ZodError) {
        return createErrorResponse({
          message: 'Validation Error',
          errors: error.flatten().fieldErrors
        })
      }
      return createErrorResponse(error)
    }
  }
}

export function withValidation(schema: any, handler: Function) {
  return async function (request: Request) {
    try {
      const body = await request.json()
      const validatedData = await schema.parseAsync(body)
      return handler(validatedData)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}

export function withPagination(handler: Function) {
  return async function (request: Request) {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    try {
      const result = await handler({ page, limit, offset })
      return NextResponse.json(result)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}

export function withCaching(handler: Function, options = { maxAge: 3600 }) {
  return async function (request: Request) {
    try {
      const response = await handler(request)
      
      if (response instanceof NextResponse) {
        response.headers.set('Cache-Control', `public, max-age=${options.maxAge}`)
      }
      
      return response
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}

export function withRateLimit(handler: Function, options = { limit: 100, window: 60 }) {
  const requests = new Map<string, number[]>()

  return async function (request: Request) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - (options.window * 1000)

    // Clean up old requests
    requests.forEach((timestamps, key) => {
      requests.set(key, timestamps.filter(time => time > windowStart))
    })

    // Get request count for this IP
    const ipRequests = requests.get(ip) || []
    requests.set(ip, [...ipRequests, now])

    if (ipRequests.length >= options.limit) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: Math.ceil((windowStart + (options.window * 1000) - now) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(options.window)
          }
        }
      )
    }

    try {
      return await handler(request)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
} 