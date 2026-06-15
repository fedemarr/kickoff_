import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/store/ProductCard'
import { FilterSidebar } from '@/components/store/FilterSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Selecciones' }
export const revalidate = 60

interface PageProps {
  searchParams: { marca?: string; precio?: string; page?: string; orden?: string }
}

async function getProducts(searchParams: PageProps['searchParams']) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  const priceFilter: { price?: { gte?: number; lte?: number } } = {}
  if (searchParams.precio) {
    const [min, max] = searchParams.precio.split('-')
    if (min) priceFilter.price = { ...priceFilter.price, gte: Number(min) }
    if (max) priceFilter.price = { ...priceFilter.price, lte: Number(max) }
  }

  const where = {
    active: true,
    category: 'SELECCIONES' as const,
    ...(searchParams.marca ? { brand: searchParams.marca } : {}),
    ...(searchParams.precio ? { variants: { some: priceFilter } } : {}),
  }

  const orderBy = searchParams.orden === 'precio-asc'
    ? { variants: { _count: 'asc' as const } }
    : { createdAt: 'desc' as const }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { variants: true }, skip, take: limit, orderBy }),
      prisma.product.count({ where }),
    ])
    return { products, total, page, totalPages: Math.ceil(total / limit) }
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function SeleccionesPage({ searchParams }: PageProps) {
  const { products, total, page, totalPages } = await getProducts(searchParams)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4">
        <span>Inicio</span> / <span className="text-gray-700 font-medium">Selecciones</span>
      </nav>

      <h1 className="text-3xl font-black uppercase mb-8">SELECCIONES</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <Suspense>
          <FilterSidebar category="SELECCIONES" />
        </Suspense>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>{total} producto{total !== 1 ? 's' : ''}</span>
            <select className="border rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-primary">
              <option value="newest">Más nuevos primero</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No encontramos productos con esos filtros.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <a
                      key={i}
                      href={`?page=${i + 1}`}
                      className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
