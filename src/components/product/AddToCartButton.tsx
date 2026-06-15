'use client'
import { useState } from 'react'
import { ShoppingCart, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import type { Product, ProductVariant } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant | null
  quantity: number
  onNoSize: () => void
}

export function AddToCartButton({ product, selectedVariant, quantity, onNoSize }: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    if (!selectedVariant) {
      onNoSize()
      return
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3.5 rounded font-bold uppercase tracking-wide text-sm transition-all flex items-center justify-center gap-2 ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-primary hover:bg-primary-dark text-white'
      }`}
    >
      {added ? (
        <>
          <CheckCircle size={18} />
          ¡Agregado al carrito!
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          AÑADIR AL CARRITO
        </>
      )}
    </button>
  )
}
