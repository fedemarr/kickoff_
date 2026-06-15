import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context {
  params: { id: string }
}

export async function GET(_: Request, { params }: Context) {
  try {
    // Support both id and slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        active: true,
      },
      include: { variants: { orderBy: { size: 'asc' } } },
    })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const body = await request.json()
    const { variants, ...productData } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: productData,
      include: { variants: true },
    })

    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    await prisma.product.update({
      where: { id: params.id },
      data: { deletedAt: new Date(), active: false },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}
