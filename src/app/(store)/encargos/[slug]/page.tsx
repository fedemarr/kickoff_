import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getVentanaEncargo } from '@/lib/encargos'
import { EncargoDetailClient } from '@/components/encargos/EncargoDetailClient'
import type { Metadata } from 'next'

interface PageProps { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await prisma.encargoProduct.findUnique({ where: { slug: params.slug } }).catch(() => null)
  return p ? { title: `Encargo: ${p.name}` } : { title: 'Encargo' }
}

export default async function EncargoDetailPage({ params }: PageProps) {
  let product: any = null
  let config: any = null

  try {
    [product, config] = await Promise.all([
      prisma.encargoProduct.findUnique({ where: { slug: params.slug, active: true } }),
      prisma.siteConfig.findUnique({ where: { id: 'main' } }),
    ])
  } catch {}

  if (!product) notFound()

  const ventana = getVentanaEncargo({
    window1Start: config?.encargoWindow1Start,
    window1End: config?.encargoWindow1End,
    window2Start: config?.encargoWindow2Start,
    window2End: config?.encargoWindow2End,
    overrideOpen: config?.encargoWindowOpen === false ? false : null,
  })

  return (
    <EncargoDetailClient
      product={product}
      ventana={ventana}
      encargoWhatsapp={config?.encargoWhatsapp || ''}
    />
  )
}
