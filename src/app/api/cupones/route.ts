import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(coupons)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const coupon = await prisma.coupon.create({ data: body })
    return NextResponse.json(coupon, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
