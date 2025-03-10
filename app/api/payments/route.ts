import { NextResponse } from 'next/server'
import { paymentSchema } from '@/lib/validations/property'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('paymentId')
    const propertyId = searchParams.get('propertyId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    if (paymentId) {
      const payment = await db.payment.findUnique({
        where: { id: paymentId }
      })

      if (!payment) {
        return new NextResponse('Payment not found', { status: 404 })
      }

      return NextResponse.json(payment)
    }

    const where: any = {}
    if (propertyId) where.propertyId = propertyId
    if (status) where.status = status
    if (type) where.type = type

    // If user is a tenant, only show their payments
    if (session.user.role === 'tenant') {
      const tenancies = await db.tenancy.findMany({
        where: {
          userId: session.user.id,
          endDate: {
            gte: new Date()
          }
        },
        select: {
          id: true
        }
      })

      where.tenantId = {
        in: tenancies.map((t) => t.id)
      }
    }

    const payments = await db.payment.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      include: {
        property: true,
        unit: true,
        tenancy: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('[PAYMENTS_GET]', error)
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
    const body = paymentSchema.parse(json)

    // Verify that the user has access to make payments for this property/unit
    const tenancy = await db.tenancy.findFirst({
      where: {
        id: body.tenantId,
        userId: session.user.id,
        endDate: {
          gte: new Date()
        }
      }
    })

    if (!tenancy && session.user.role === 'tenant') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const payment = await db.payment.create({
      data: {
        ...body,
        date: new Date(body.date),
        dueDate: new Date(body.dueDate),
        status: 'pending'
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[PAYMENTS_POST]', error)
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
    const body = paymentSchema.parse(json)

    const payment = await db.payment.findUnique({
      where: { id: body.id },
      include: {
        tenancy: true
      }
    })

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 })
    }

    // Only allow updates if user is admin/owner or the payment is for their tenancy
    if (
      session.user.role === 'tenant' &&
      payment.tenancy.userId !== session.user.id
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const updatedPayment = await db.payment.update({
      where: { id: body.id },
      data: {
        ...body,
        date: new Date(body.date),
        dueDate: new Date(body.dueDate)
      }
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    if (error.name === 'ZodError') {
      return new NextResponse('Invalid request data', { status: 422 })
    }

    console.error('[PAYMENTS_PUT]', error)
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
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) {
      return new NextResponse('Payment ID required', { status: 400 })
    }

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        tenancy: true
      }
    })

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 })
    }

    // Only allow deletion if user is admin/owner or the payment is for their tenancy
    if (
      session.user.role === 'tenant' &&
      payment.tenancy.userId !== session.user.id
    ) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    await db.payment.delete({
      where: { id: paymentId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[PAYMENTS_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 