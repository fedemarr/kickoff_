import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sale — Ofertas especiales' }
export const revalidate = 60

export default async function SalePage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { active: true, tag: 'SALE' },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4"><span>Inicio</span> / <span className="text-primary font-bold">SALE</span></nav>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-black uppercase">SALE</h1>
        <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded animate-pulse">HASTA 30% OFF</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && (
        <div className="text-center py-16 text-gray-400"><p>No hay productos en oferta en este momento.</p></div>
      )}
    </div>
  )
}
