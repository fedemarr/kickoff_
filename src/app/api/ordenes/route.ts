import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderNumber } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = Number(searchParams.get('limit')) || 50

    const where: any = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, ...orderData } = body

    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            productName: item.productName,
          })),
        },
      },
      include: { items: true },
    })

    // Decrease stock
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
  }
}
