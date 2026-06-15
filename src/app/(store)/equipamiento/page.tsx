import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/store/ProductCard'
import { FilterSidebar } from '@/components/store/FilterSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Equipamiento' }
export const revalidate = 60

interface PageProps {
  searchParams: { marca?: string; precio?: string; page?: string }
}

export default async function EquipamientoPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit
  const where = { active: true, category: 'EQUIPAMIENTO' as const, ...(searchParams.marca ? { brand: searchParams.marca } : {}) }

  let products: any[] = []
  let total = 0
  let totalPages = 0
  try {
    ;[products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { variants: true }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ])
    totalPages = Math.ceil(total / limit)
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4"><span>Inicio</span> / <span className="text-gray-700 font-medium">Equipamiento</span></nav>
      <h1 className="text-3xl font-black uppercase mb-8">EQUIPAMIENTO</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Suspense><FilterSidebar category="EQUIPAMIENTO" /></Suspense>
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{total} producto{total !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
