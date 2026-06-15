import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductAccordion } from '@/components/product/ProductAccordion'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, active: true },
    })
    if (!product) return { title: 'Producto no encontrado' }
    return {
      title: product.name,
      description: product.description || `Comprá ${product.name} en KickOff. Envío a todo Argentina.`,
    }
  } catch {
    return { title: 'Producto' }
  }
}

export default async function ProductPage({ params }: PageProps) {
  let product: any = null
  let related: any[] = []
  let config: any = null

  try {
    [product, config] = await Promise.all([
      prisma.product.findUnique({
        where: { slug: params.slug, active: true },
        include: { variants: { orderBy: { size: 'asc' } } },
      }),
      prisma.siteConfig.findUnique({ where: { id: 'main' } }),
    ])

    if (product) {
      related = await prisma.product.findMany({
        where: { active: true, category: product.category, id: { not: product.id } },
        include: { variants: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })
    }
  } catch {}

  if (!product) notFound()

  const accordionItems = [
    product.details && { title: 'Detalles', content: product.details },
    product.returns && { title: 'Cambios y Devoluciones', content: product.returns },
    product.sizeChart && { title: 'Tabla de Talles', content: product.sizeChart },
  ].filter(Boolean) as { title: string; content: string }[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <a href="/" className="hover:text-gray-700">Inicio</a>
        {' / '}
        <a href={`/${product.category.toLowerCase()}`} className="hover:text-gray-700 capitalize">
          {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
        </a>
        {' / '}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product info */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">{product.name}</h1>

          <ProductDetailClient
            product={product}
            config={config}
          />

          {accordionItems.length > 0 && (
            <div className="mt-6">
              <ProductAccordion items={accordionItems} />
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded" />
            <h2 className="text-2xl font-black uppercase">PRODUCTOS RELACIONADOS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
