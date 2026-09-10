import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

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

function cleanInt(val: unknown): number | null {
  if (val === '' || val === null || val === undefined) return null
  const n = Math.trunc(Number(val))
  return Number.isFinite(n) ? n : null
}

export async function PUT(request: Request, { params }: Context) {
  try {
    const body = await request.json()
    const {
      variants,
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      deletedAt: _deletedAt,
      _count: _dropCount,
      ...productData
    } = body

    // 1. Update the product's own fields
    await prisma.product.update({
      where: { id: params.id },
      data: productData,
    })

    // 2. Sync variants (price / oldPrice / stock / size / sku)
    if (Array.isArray(variants)) {
      const keepIds: string[] = []

      for (const v of variants) {
        const size = String(v.size ?? '').trim()
        if (!size) continue // skip empty rows

        const price = cleanInt(v.price) ?? 0
        const stock = Math.max(0, cleanInt(v.stock) ?? 0)
        const oldPrice = cleanInt(v.oldPrice)
        const sku = v.sku && String(v.sku).trim() ? String(v.sku).trim() : null

        const data = { size, price, stock, oldPrice, sku }

        if (v.id) {
          await prisma.productVariant.update({ where: { id: v.id }, data })
          keepIds.push(v.id)
        } else {
          const created = await prisma.productVariant.create({
            data: { ...data, productId: params.id },
          })
          keepIds.push(created.id)
        }
      }

      // 3. Remove variants the user deleted — but only if no order references them
      const removed = await prisma.productVariant.findMany({
        where: { productId: params.id, id: { notIn: keepIds } },
        include: { _count: { select: { orderItems: true } } },
      })
      for (const r of removed) {
        if (r._count.orderItems === 0) {
          await prisma.productVariant.delete({ where: { id: r.id } })
        }
      }
    }

    const result = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: { orderBy: { size: 'asc' } } },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[producto PUT]', error)
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
