import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CheckoutFailurePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
        <XCircle size={40} className="text-primary" />
      </div>
      <h1 className="text-3xl font-black mb-3">Hubo un problema con el pago</h1>
      <p className="text-gray-500 mb-8">No se pudo procesar tu pago. Tu pedido no fue confirmado.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/checkout" className="btn-primary">Reintentar pago</Link>
        <Link href="/carrito" className="border border-gray-300 rounded px-6 py-3 font-semibold hover:border-primary hover:text-primary transition-colors text-sm uppercase">
          Volver al carrito
        </Link>
      </div>
    </div>
  )
}
