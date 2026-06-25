'use client'
import { useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import type { PaymentMethod } from '@/types'

export interface CheckoutFormData {
  dni: string
  firstName: string
  lastName: string
  street: string
  city: string
  province: string
  zipCode: string
  phone: string
  email: string
  notes?: string
  paymentMethod: PaymentMethod
  couponCode?: string
}

export function useCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, total, clearCart } = useCartStore()

  async function submitCheckout(data: CheckoutFormData) {
    setLoading(true)
    setError(null)

    try {
      const orderRes = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            variantId: item.variantId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            size: item.size,
            productName: item.productName,
          })),
          subtotal: total(),
          total: total(),
        }),
      })

      if (!orderRes.ok) throw new Error('Error creando la orden')
      const order = await orderRes.json()

      if (data.paymentMethod === 'MERCADOPAGO') {
        const mpRes = await fetch('/api/checkout/mp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        })
        if (!mpRes.ok) {
          const errData = await mpRes.json().catch(() => ({}))
          throw new Error(errData.error || 'Error creando preferencia MP')
        }
        const { checkoutUrl } = await mpRes.json()
        clearCart()
        window.location.href = checkoutUrl
      } else {
        clearCart()
        return { orderId: order.id, orderNumber: order.orderNumber }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { submitCheckout, loading, error }
}
