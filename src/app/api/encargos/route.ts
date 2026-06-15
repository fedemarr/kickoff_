import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getVentanaEncargo, getVentanaLabel } from '@/lib/encargos'

export async function GET() {
  try {
    const encargos = await prisma.encargo.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(encargos)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, size, name, phone, email, notes } = body

    const product = await prisma.encargoProduct.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
    const ventanaInfo = getVentanaEncargo({
      window1Start: config?.encargoWindow1Start,
      window1End: config?.encargoWindow1End,
      window2Start: config?.encargoWindow2Start,
      window2End: config?.encargoWindow2End,
      overrideOpen: config?.encargoWindowOpen === false ? false : null,
    })

    if (!ventanaInfo.isOpen) {
      return NextResponse.json({ error: 'Encargos cerrados' }, { status: 400 })
    }

    const ventanaLabel = getVentanaLabel(ventanaInfo)

    const encargo = await prisma.encargo.create({
      data: {
        productId,
        productName: product.name,
        brand: product.brand,
        size,
        name,
        phone,
        email,
        notes,
        ventana: ventanaLabel,
      },
    })

    return NextResponse.json(encargo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating encargo' }, { status: 500 })
  }
}
