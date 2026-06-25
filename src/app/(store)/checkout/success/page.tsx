import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/db'

interface PageProps {
  searchParams: { order?: string }
}

const WA_NUMBER = '5491156192976'

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  let order: any = null

  try {
    if (searchParams.order) {
      order = await prisma.order.findUnique({
        where: { orderNumber: searchParams.order },
        include: { items: true },
      })
    }
  } catch {}

  const waMessage = order
    ? `Hola! Acabo de realizar el pedido #${order.orderNumber} en KickOff. Quiero coordinar el envío.`
    : `Hola! Quiero coordinar el envío de mi pedido en KickOff.`

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`

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

      <p className="text-gray-500 mb-8">
        Te enviamos un email con los detalles del pedido.
      </p>

      {/* WhatsApp para coordinar envío */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <p className="font-bold text-gray-900 mb-1">¡Coordiná tu envío!</p>
        <p className="text-sm text-gray-500 mb-4">
          Los envíos se coordinan directamente con el vendedor por WhatsApp.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#20b857] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Coordinar envío por WhatsApp
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">Seguir comprando</Link>
        <Link href="/selecciones" className="border border-gray-300 rounded px-6 py-3 font-semibold hover:border-primary hover:text-primary transition-colors text-sm uppercase tracking-wide">
          Ver más productos
        </Link>
      </div>
    </div>
  )
}
