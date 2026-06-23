import { prisma } from '@/lib/db'
import { getVentanaEncargo } from '@/lib/encargos'
import { EncargosClient } from '@/components/encargos/EncargosClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Encargos — Pedidos especiales' }
export const dynamic = 'force-dynamic'

export default async function EncargosPage() {
  let products: any[] = []
  let config: any = null

  try {
    [products, config] = await Promise.all([
      prisma.encargoProduct.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
      prisma.siteConfig.findUnique({ where: { id: 'main' } }),
    ])
  } catch {}

  const ventana = getVentanaEncargo({
    window1Start: config?.encargoWindow1Start,
    window1End: config?.encargoWindow1End,
    window2Start: config?.encargoWindow2Start,
    window2End: config?.encargoWindow2End,
    overrideOpen: config?.encargoWindowOpen === false ? false : null,
  })

  return (
    <EncargosClient
      products={products}
      ventana={ventana}
      encargoWhatsapp={config?.encargoWhatsapp || ''}
      legalText={config?.encargoLegalText || ''}
      deliveryTime={config?.encargoDeliveryTime || '15 a 30 días hábiles'}
    />
  )
}
