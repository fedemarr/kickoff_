import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    await prisma.waitlistEmail.upsert({
      where: { email },
      update: {},
      create: { email },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
