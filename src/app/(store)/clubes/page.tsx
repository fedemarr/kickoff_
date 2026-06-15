import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/store/ProductCard'
import { FilterSidebar } from '@/components/store/FilterSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Clubes' }
export const revalidate = 60

interface PageProps {
  searchParams: { marca?: string; precio?: string; page?: string }
}

async function getProducts(searchParams: PageProps['searchParams']) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  const where = {
    active: true,
    category: 'CLUBES' as const,
    ...(searchParams.marca ? { brand: searchParams.marca } : {}),
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { variants: true }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ])
    return { products, total, page, totalPages: Math.ceil(total / limit) }
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function ClubesPage({ searchParams }: PageProps) {
  const { products, total, page, totalPages } = await getProducts(searchParams)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <span>Inicio</span> / <span className="text-gray-700 font-medium">Clubes</span>
      </nav>
      <h1 className="text-3xl font-black uppercase mb-8">CLUBES</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <Suspense>
          <FilterSidebar category="CLUBES" />
        </Suspense>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span>{total} producto{total !== 1 ? 's' : ''}</span>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400"><p className="text-lg">No hay productos disponibles.</p></div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <a key={i} href={`?page=${i + 1}`} className={`w-9 h-9 flex items-center justify-center rounded border text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:border-primary hover:text-primary'}`}>{i + 1}</a>
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
