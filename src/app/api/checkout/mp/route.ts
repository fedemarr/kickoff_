import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPreference } from '@/lib/mercadopago'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })

    const cartItems = order.items.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      productName: item.productName,
      slug: '',
      image: '',
      size: item.size,
      price: item.unitPrice,
      quantity: item.quantity,
    }))

    const preference = await createPreference({
      orderId: order.id,
      orderNumber: order.orderNumber,
      items: cartItems,
      payer: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        street: order.street,
        zipCode: order.zipCode,
      },
      installments: config?.installments ?? 3,
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { mpPreferenceId: preference.id },
    })

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error('MP preference error:', error)
    return NextResponse.json({ error: 'Error creating MP preference' }, { status: 500 })
  }
}
