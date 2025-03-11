import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-change-it-in-production'
)

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication token is required' }),
        { status: 401 }
      )
    }

    const { payload } = await jwtVerify(token, secret)
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string
    }

    return handler(authenticatedRequest)
  } catch (error) {
    console.error('Authentication error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401 }
    )
  }
}

export function withRole(roles: string[]) {
  return async function (
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403 }
        )
      }
      return handler(req)
    })
  }
}

export const adminOnly = withRole(['ADMIN'])
export const landlordOnly = withRole(['ADMIN', 'LANDLORD'])
export const authenticatedOnly = withAuth 