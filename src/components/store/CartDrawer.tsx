'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">Tu carrito ({items.length})</h2>
              <button onClick={closeCart} className="p-1 hover:text-primary transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                  <ShoppingBag size={60} strokeWidth={1} />
                  <p className="font-medium text-gray-600">Tu carrito está vacío</p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    Ver productos
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-2 text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Talle: {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 rounded border text-sm flex items-center justify-center hover:border-primary hover:text-primary"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 rounded border text-sm flex items-center justify-center hover:border-primary hover:text-primary"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 text-base">{formatPrice(cartTotal)}</span>
                </div>
                {cartTotal >= 150000 ? (
                  <p className="text-xs text-green-600 font-medium">✓ Envío gratis incluido</p>
                ) : (
                  <p className="text-xs text-gray-500">Envío gratis en compras superiores a {formatPrice(150000)}</p>
                )}
                <Link href="/checkout" onClick={closeCart} className="btn-primary w-full text-center block">
                  IR AL CHECKOUT →
                </Link>
                <button onClick={closeCart} className="w-full text-sm text-gray-500 hover:text-primary transition-colors py-1">
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
