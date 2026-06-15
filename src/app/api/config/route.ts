import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
    if (!config) {
      await prisma.siteConfig.create({ data: { id: 'main' } })
      return NextResponse.json(await prisma.siteConfig.findUnique({ where: { id: 'main' } }))
    }
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching config' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const config = await prisma.siteConfig.upsert({
      where: { id: 'main' },
      update: body,
      create: { id: 'main', ...body },
    })
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating config' }, { status: 500 })
  }
}
