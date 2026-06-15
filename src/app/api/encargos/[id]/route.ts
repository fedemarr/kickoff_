import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context { params: { id: string } }

export async function PUT(request: Request, { params }: Context) {
  try {
    const body = await request.json()
    const encargo = await prisma.encargo.update({ where: { id: params.id }, data: body })
    return NextResponse.json(encargo)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
