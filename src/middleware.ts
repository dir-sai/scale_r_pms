import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, number>()

// Rate limit configuration
const RATE_LIMIT = 10 // requests
const TIME_WINDOW = 10 * 1000 // 10 seconds in milliseconds

// Security headers following OWASP recommendations
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;",
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api')) {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1'
    const now = Date.now()
    const windowStart = now - TIME_WINDOW

    // Clean up old entries
    Array.from(rateLimit.entries()).forEach(([key, timestamp]) => {
      if (timestamp < windowStart) {
        rateLimit.delete(key)
      }
    })

    // Count requests in the current window
    const requestCount = Array.from(rateLimit.entries()).filter(
      ([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart
    ).length

    if (requestCount >= RATE_LIMIT) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (Math.ceil(now / TIME_WINDOW) * TIME_WINDOW).toString()
        }
      })
    }

    // Add current request to the rate limit map
    rateLimit.set(`${ip}_${now}`, now)
  }

  // Clone the response to add headers
  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)'
  ]
} 