import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'
import { Tag } from 'lucide-react'

export const metadata: Metadata = { title: 'Pre Venta — KickOff Rugby' }
export const dynamic = 'force-dynamic'

async function getPreventaProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true, tag: 'PREVENTA' },
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function PreventaPage() {
  const products = await getPreventaProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <span>Inicio</span> / <span className="text-gray-700 font-medium">Pre Venta</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase mb-2">PRE VENTA</h1>
        <p className="text-gray-500 text-sm max-w-xl">
          Reservá antes de que salgan al stock general. Productos disponibles por tiempo limitado con precio especial de pre venta.
        </p>
      </div>

      {/* Banner info */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 flex items-start gap-3">
        <Tag size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">¿Cómo funciona la pre venta?</p>
          <p className="text-gray-500">Realizá tu pedido y lo despachamos en cuanto llegue el stock. Te avisamos por email o WhatsApp. El pago se realiza al momento de confirmar la reserva.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-4xl mb-4">🏉</p>
          <p className="text-xl font-bold text-gray-700 mb-2">Próximamente</p>
          <p className="text-sm">No hay productos en pre venta por el momento. ¡Volvé pronto!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      )}
    </div>
  )
}
