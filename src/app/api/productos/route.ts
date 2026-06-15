import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const featured = searchParams.get('featured')
    const limit = Number(searchParams.get('limit')) || 100
    const skip = Number(searchParams.get('skip')) || 0

    const where: any = { active: true, deletedAt: null }
    if (category) where.category = category.toUpperCase()
    if (tag) where.tag = tag.toUpperCase()
    if (featured === 'true') where.featured = true

    const products = await prisma.product.findMany({
      where,
      include: { variants: { orderBy: { size: 'asc' } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { variants, ...productData } = body

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}
