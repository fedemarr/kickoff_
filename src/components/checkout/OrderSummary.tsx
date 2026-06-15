'use client'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'

export function OrderSummary() {
  const { items, total } = useCartStore()
  const cartTotal = total()
  const freeShipping = cartTotal >= 150000

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h3 className="font-black uppercase text-sm tracking-wide mb-4">TU PEDIDO</h3>

      <div className="border-b border-gray-200 pb-3 mb-3">
        <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
          <span>Producto</span>
          <span>Subtotal</span>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-3 items-start">
              <div className="relative w-12 h-12 rounded bg-white border shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.productName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2">{item.productName}</p>
                <p className="text-xs text-gray-400 mt-0.5">T: {item.size} × {item.quantity}</p>
              </div>
              <span className="text-xs font-bold text-gray-800 shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span className={freeShipping ? 'font-bold text-green-600' : 'font-medium'}>
            {freeShipping ? 'GRATIS' : 'A calcular'}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between font-black text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(cartTotal)}</span>
        </div>
      </div>
    </div>
  )
}
