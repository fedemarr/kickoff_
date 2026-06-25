import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context { params: { id: string } }

export async function GET(_: Request, { params }: Context) {
  try {
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const body = await request.json()
    const data: any = {}
    if (body.status) data.status = body.status
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus
    if (body.shippingCompany !== undefined) data.shippingCompany = body.shippingCompany
    if (body.trackingCode !== undefined) data.trackingCode = body.trackingCode
    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { items: true },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
  }
}
