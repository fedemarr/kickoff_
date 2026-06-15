'use client'
import { useState } from 'react'
import { SizeSelector } from './SizeSelector'
import { PriceBlock } from './PriceBlock'
import { AddToCartButton } from './AddToCartButton'
import type { Product, ProductVariant } from '@/types'

interface ProductDetailClientProps {
  product: Product
  config: {
    transferDiscount: number
    installments: number
    shippingDeadlineText: string
  } | null
}

export function ProductDetailClient({ product, config }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const selectedVariant = product.variants.find((v) => v.size === selectedSize) || null

  const handleNoSize = () => {
    setSizeError(true)
    setTimeout(() => setSizeError(false), 1000)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSizeError(false)
    setQuantity(1)
  }

  const displayVariant = selectedVariant || product.variants[0]

  return (
    <div className="space-y-5">
      {displayVariant && (
        <PriceBlock
          variant={displayVariant as ProductVariant}
          transferDiscount={config?.transferDiscount}
          installments={config?.installments}
          shippingText={config?.shippingDeadlineText}
        />
      )}

      <div className="h-px bg-gray-200" />

      <SizeSelector
        variants={product.variants as ProductVariant[]}
        selected={selectedSize}
        onSelect={handleSizeSelect}
        error={sizeError}
      />

      {/* Quantity + Add to cart */}
      <div className="flex gap-3">
        <div className="flex items-center border rounded overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2.5 font-medium text-sm w-10 text-center">{quantity}</span>
          <button
            onClick={() => {
              const maxStock = selectedVariant?.stock ?? (product.variants[0]?.stock ?? 99)
              setQuantity(Math.min(maxStock, quantity + 1))
            }}
            className="px-3 py-2.5 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            +
          </button>
        </div>

        <div className="flex-1">
          <AddToCartButton
            product={product}
            selectedVariant={selectedVariant as ProductVariant | null}
            quantity={quantity}
            onNoSize={handleNoSize}
          />
        </div>
      </div>
    </div>
  )
}
