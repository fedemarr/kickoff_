import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/db'

interface PageProps {
  searchParams: { order?: string }
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  let order: any = null
  let config: any = null

  try {
    if (searchParams.order) {
      order = await prisma.order.findUnique({
        where: { orderNumber: searchParams.order },
        include: { items: true },
      })
    }
    config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
  } catch {}

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>

      <h1 className="text-3xl font-black mb-3">¡Gracias por tu compra!</h1>
      {order && (
        <p className="text-gray-500 mb-2">
          Número de pedido: <span className="font-bold text-gray-800">#{order.orderNumber}</span>
        </p>
      )}
      <p className="text-gray-500 mb-8">Te enviamos un email con los detalles del pedido.</p>

      {/* Transfer details */}
      {order?.paymentMethod === 'TRANSFER' && config?.cbu && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border">
          <h2 className="font-bold text-lg mb-4">Datos para la transferencia</h2>
          <div className="space-y-2 text-sm">
            {config.cbu && <div><span className="font-medium text-gray-600">CBU:</span> {config.cbu}</div>}
            {config.alias && <div><span className="font-medium text-gray-600">Alias:</span> {config.alias}</div>}
            {config.bankHolder && <div><span className="font-medium text-gray-600">Titular:</span> {config.bankHolder}</div>}
            {order && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-medium text-yellow-800">Referencia: Pedido #{order.orderNumber}</p>
                <p className="text-xs text-yellow-700 mt-1">Incluí esta referencia en la transferencia.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">Seguir comprando</Link>
        <Link href="/selecciones" className="border border-gray-300 rounded px-6 py-3 font-semibold hover:border-primary hover:text-primary transition-colors text-sm uppercase tracking-wide">
          Ver más productos
        </Link>
      </div>
    </div>
  )
}
