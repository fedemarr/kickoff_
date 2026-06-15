import { prisma } from '@/lib/db'
import { HeroBanner } from '@/components/store/HeroBanner'
import { BenefitsBar } from '@/components/store/BenefitsBar'
import { CategoryGrid } from '@/components/store/CategoryGrid'
import { ProductCarousel } from '@/components/store/ProductCarousel'
import { StatsBar } from '@/components/store/StatsBar'
import { BrandsCarousel } from '@/components/store/BrandsCarousel'
import { TestimonialsSlider } from '@/components/store/TestimonialsSlider'

export const dynamic = 'force-dynamic'

async function getHomeProducts() {
  try {
    const [bestSellers, newArrivals, saleProducts] = await Promise.all([
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
      prisma.product.findMany({
        where: { active: true, tag: 'SALE' },
        include: { variants: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ])
    return { bestSellers, newArrivals, saleProducts }
  } catch {
    return { bestSellers: [], newArrivals: [], saleProducts: [] }
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
  const [{ bestSellers, newArrivals, saleProducts }, config] = await Promise.all([
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

      {saleProducts.length > 0 && (
        <ProductCarousel
          title="SALE"
          products={saleProducts as any}
          viewMoreHref="/sale"
          badgeColor="bg-yellow-500"
        />
      )}

      <BrandsCarousel />
      <TestimonialsSlider />
    </>
  )
}
