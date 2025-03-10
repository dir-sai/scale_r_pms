import { NextResponse } from 'next/server'
import { maintenanceRequestSchema } from '@/lib/validations/property'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('requestId')
    const propertyId = searchParams.get('propertyId')
    const status = searchParams.get('status')

    if (requestId) {
      const request = await db.maintenanceRequest.findUnique({
        where: { id: requestId }
      })

      if (!request) {
        return new NextResponse('Maintenance request not found', { status: 404 })
      }

      return NextResponse.json(request)
    }

    const where: any = {}
    if (propertyId) where.propertyId = propertyId
    if (status) where.status = status

    // If user is a tenant, only show their requests
    if (session.user.role === 'tenant') {
      where.tenantId = session.user.id
    }

    const requests = await db.maintenanceRequest.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      include: {
        property: true,
        unit: true
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('[MAINTENANCE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = maintenanceRequestSchema.parse(json)

    // Verify that the user has access to the property/unit
    const tenancy = await db.tenancy.findFirst({
      where: {
        userId: session.user.id,
        unitId: body.unitId,
        endDate: {
          gte: new Date()
        }
      }
    })

    if (!tenancy && session.user.role === 'tenant') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const request = await db.maintenanceRequest.create({
      data: {
        ...body,
        date: new Date(body.date),
        tenantId: session.user.id,
        status: 'open'
      }
    })

    return NextResponse.json(request)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[MAINTENANCE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = maintenanceRequestSchema.parse(json)

    const request = await db.maintenanceRequest.findUnique({
      where: { id: body.id }
    })

    if (!request) {
      return new NextResponse('Maintenance request not found', { status: 404 })
    }

    // Only allow updates if user is admin/owner or the original requester
    if (session.user.role === 'tenant' && request.tenantId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const updatedRequest = await db.maintenanceRequest.update({
      where: { id: body.id },
      data: {
        ...body,
        date: new Date(body.date),
        updates: [
          ...(request.updates as any[]),
          {
            date: new Date().toISOString(),
            status: body.status,
            comment: body.description,
            updatedBy: session.user.id
          }
        ]
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[MAINTENANCE_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('requestId')

    if (!requestId) {
      return new NextResponse('Request ID required', { status: 400 })
    }

    const request = await db.maintenanceRequest.findUnique({
      where: { id: requestId }
    })

    if (!request) {
      return new NextResponse('Maintenance request not found', { status: 404 })
    }

    // Only allow deletion if user is admin/owner or the original requester
    if (session.user.role === 'tenant' && request.tenantId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await db.maintenanceRequest.delete({
      where: { id: requestId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[MAINTENANCE_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 