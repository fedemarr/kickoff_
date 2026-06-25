import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendShippingEmail } from '@/lib/email'

interface Context { params: { id: string } }

function trackingUrl(company: string, code: string) {
  if (!code) return null
  if (company === 'Via Cargo') return `https://www.viacargo.com.ar/seguimiento/?nro=${code}`
  if (company === 'OCA') return `https://www.oca.com.ar/seguimiento-de-envios/?id=${code}`
  if (company === 'Andreani') return `https://www.andreani.com/#!/informacionEnvio/${code}`
  return null
}

export async function POST(_: Request, { params }: Context) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!order.trackingCode) return NextResponse.json({ error: 'No tracking code set' }, { status: 400 })

    await sendShippingEmail({
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      email: order.email,
      phone: order.phone,
      shippingCompany: order.shippingCompany || 'Via Cargo',
      trackingCode: order.trackingCode,
      trackingUrl: trackingUrl(order.shippingCompany || '', order.trackingCode),
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Shipping email error:', error?.message)
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}
