import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ error: 'No payment id' }, { status: 400 })

    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    const orderId = paymentData.external_reference
    if (!orderId) return NextResponse.json({ received: true })

    const mpStatus = paymentData.status

    let paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' = 'PENDING'
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' = 'PENDING'

    if (mpStatus === 'approved') {
      paymentStatus = 'PAID'
      orderStatus = 'CONFIRMED'
    } else if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
      paymentStatus = 'FAILED'
      orderStatus = 'CANCELLED'
    } else if (mpStatus === 'refunded') {
      paymentStatus = 'REFUNDED'
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status: orderStatus,
        mpPaymentId: String(paymentId),
      },
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('MP webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
