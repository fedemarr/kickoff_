import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Context { params: { id: string } }

export async function PUT(request: Request, { params }: Context) {
  try {
    const body = await request.json()

    const data: { stock?: number; price?: number; oldPrice?: number | null } = {}

    if (body.stock !== undefined) {
      const stock = Math.trunc(Number(body.stock))
      if (!Number.isFinite(stock) || stock < 0) {
        return NextResponse.json({ error: 'Stock inválido' }, { status: 400 })
      }
      data.stock = stock
    }

    if (body.price !== undefined) {
      const price = Math.trunc(Number(body.price))
      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
      }
      data.price = price
    }

    if (body.oldPrice !== undefined) {
      data.oldPrice = body.oldPrice === null ? null : Math.trunc(Number(body.oldPrice))
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nada para actualizar' }, { status: 400 })
    }

    const variant = await prisma.productVariant.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(variant)
  } catch (error) {
    console.error('[variante PUT]', error)
    return NextResponse.json({ error: 'Error actualizando la variante' }, { status: 500 })
  }
}
