import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const TAG_LABELS: Record<string, string> = { NONE: '', NEW: 'Nuevo', SALE: 'Sale', FEATURED: 'Destacado' }
const CAT_LABELS: Record<string, string> = { SELECCIONES: 'Selecciones', CLUBES: 'Clubes', EQUIPAMIENTO: 'Equipamiento' }

export default async function AdminProductsPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Precio</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => {
              const totalStock = p.variants.reduce((s: number, v: any) => s + v.stock, 0)
              const minPrice = p.variants.length ? Math.min(...p.variants.map((v: any) => v.price)) : 0

              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{CAT_LABELS[p.category]}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(minPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${totalStock === 0 ? 'text-red-500' : totalStock <= 5 ? 'text-orange-500' : 'text-green-600'}`}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                    {p.tag !== 'NONE' && (
                      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {TAG_LABELS[p.tag]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/productos/${p.id}`} className="text-xs text-primary hover:underline">
                      Editar →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay productos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
