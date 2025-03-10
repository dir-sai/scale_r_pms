import { NextResponse } from 'next/server'
import { propertySchema } from '@/lib/validations/property'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')

    if (propertyId) {
      const property = await db.property.findUnique({
        where: { id: propertyId }
      })

      if (!property) {
        return new NextResponse('Property not found', { status: 404 })
      }

      return NextResponse.json(property)
    }

    const properties = await db.property.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            units: {
              some: {
                tenants: {
                  some: { userId: session.user.id }
                }
              }
            }
          }
        ]
      },
      include: {
        units: {
          include: {
            tenants: true
          }
        }
      }
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('[PROPERTIES_GET]', error)
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
    const body = propertySchema.parse(json)

    const property = await db.property.create({
      data: {
        ...body,
        ownerId: session.user.id
      }
    })

    return NextResponse.json(property)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[PROPERTIES_POST]', error)
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
    const body = propertySchema.parse(json)

    const property = await db.property.findUnique({
      where: { id: body.id }
    })

    if (!property) {
      return new NextResponse('Property not found', { status: 404 })
    }

    if (property.ownerId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const updatedProperty = await db.property.update({
      where: { id: body.id },
      data: body
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[PROPERTIES_PUT]', error)
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
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return new NextResponse('Property ID required', { status: 400 })
    }

    const property = await db.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return new NextResponse('Property not found', { status: 404 })
    }

    if (property.ownerId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await db.property.delete({
      where: { id: propertyId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[PROPERTIES_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 