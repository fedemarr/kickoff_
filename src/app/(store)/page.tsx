import { prisma } from '@/lib/db'
import { HeroBanner } from '@/components/store/HeroBanner'
import { BenefitsBar } from '@/components/store/BenefitsBar'
import { CategoryGrid } from '@/components/store/CategoryGrid'
import { ProductCarousel } from '@/components/store/ProductCarousel'
import { EncargoCarousel } from '@/components/store/EncargoCarousel'
import { StatsBar } from '@/components/store/StatsBar'
import { BrandsCarousel } from '@/components/store/BrandsCarousel'
import { TestimonialsSlider } from '@/components/store/TestimonialsSlider'

export const dynamic = 'force-dynamic'

async function getHomeProducts() {
  try {
    const [bestSellers, newArrivals, encargoProducts] = await Promise.all([
      prisma.product.findMany({
        where: { active: true, featured: true },
        include: { variants: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { active: true, tag: 'NEW' },
        include: { variants: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.encargoProduct.findMany({
        where: { active: true },
        take: 12,
        orderBy: { createdAt: 'desc' },
      }),
    ])
    return { bestSellers, newArrivals, encargoProducts }
  } catch {
    return { bestSellers: [], newArrivals: [], encargoProducts: [] }
  }
}

async function getSiteConfig() {
  try {
    return await prisma.siteConfig.findUnique({ where: { id: 'main' } })
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [{ bestSellers, newArrivals, encargoProducts }, config] = await Promise.all([
    getHomeProducts(),
    getSiteConfig(),
  ])

  const stats = config
    ? [
        { value: config.statModels, label: 'Modelos' },
        { value: config.statClients, label: 'Clientes' },
        { value: config.statSelecciones, label: 'Selecciones' },
        { value: config.statYears, label: 'Años' },
      ]
    : undefined

  return (
    <>
      <HeroBanner />
      <BenefitsBar />
      <CategoryGrid />

      <ProductCarousel
        title="BEST SELLERS"
        products={bestSellers as any}
        viewMoreHref="/selecciones"
        badgeColor="bg-primary"
      />

      <StatsBar stats={stats} />

      <ProductCarousel
        title="ÚLTIMOS INGRESOS"
        products={newArrivals as any}
        viewMoreHref="/selecciones"
        badgeColor="bg-gray-800"
      />

      <EncargoCarousel products={encargoProducts as any} />

      <BrandsCarousel />
      <TestimonialsSlider />
    </>
  )
}
