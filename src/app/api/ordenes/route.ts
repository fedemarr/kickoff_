import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendNewOrderNotification } from '@/lib/email'

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

    // Decrementar stock
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Emails para transferencia y efectivo (MP los manda el webhook cuando se confirma el pago)
    if (order.paymentMethod !== 'MERCADOPAGO') {
      let config: any = null
      try {
        config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
      } catch {}

      const emailData = {
        orderNumber: order.orderNumber,
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        street: order.street ?? '',
        city: order.city ?? '',
        province: order.province ?? '',
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: order.items.map(i => ({
          productName: i.productName,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        bankDetails: config ? {
          cbu: config.cbu ?? '',
          alias: config.alias ?? '',
          bankHolder: config.bankHolder ?? '',
        } : undefined,
      }

      // No bloqueamos la respuesta si el email falla
      Promise.all([
        sendOrderConfirmationEmail(emailData),
        sendNewOrderNotification(emailData),
      ]).catch(err => console.error('Email error:', err))
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
  }
}
