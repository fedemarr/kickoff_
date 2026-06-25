'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, discountedPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  showEncargar?: boolean
  onEncargar?: (product: Product) => void
}

const TAG_STYLES: Record<string, string> = {
  NEW: 'bg-primary text-white',
  SALE: 'bg-yellow-400 text-gray-900',
  FEATURED: 'bg-blue-600 text-white',
}

const TAG_LABELS: Record<string, string> = {
  NEW: 'Nuevo',
  SALE: 'Sale',
  FEATURED: 'Destacado',
}

export function ProductCard({ product, showEncargar = false, onEncargar }: ProductCardProps) {
  const firstVariant = product.variants[0]
  const mainImage = product.images[0] || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Sin+imagen'
  const hasDiscount = firstVariant?.oldPrice && firstVariant.oldPrice > firstVariant.price
  const discountPercent = hasDiscount
    ? Math.round(((firstVariant.oldPrice! - firstVariant.price) / firstVariant.oldPrice!) * 100)
    : 0

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.tag !== 'NONE' && (
            <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${TAG_STYLES[product.tag] || ''}`}>
              {TAG_LABELS[product.tag]}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-3">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">{product.brand}</p>
        <Link href={`/producto/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {firstVariant && (
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-gray-900">{formatPrice(firstVariant.price)}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(firstVariant.oldPrice!)}</span>
              )}
            </div>
            <p className="text-xs text-green-cuotas mt-0.5">
              3 cuotas de {formatPrice(Math.round(firstVariant.price / 3))}
            </p>
            <p className="text-xs text-green-600 font-semibold mt-0.5">
              {formatPrice(discountedPrice(firstVariant.price, 23))} por transferencia
            </p>
          </div>
        )}

        {showEncargar ? (
          <button
            onClick={() => onEncargar?.(product)}
            className="mt-3 w-full text-sm font-semibold py-2 rounded bg-primary text-white hover:bg-primary-dark transition-colors uppercase tracking-wide"
          >
            ENCARGAR
          </button>
        ) : (
          <Link
            href={`/producto/${product.slug}`}
            className="mt-3 block w-full text-center text-sm font-semibold py-2 rounded border border-gray-300 hover:border-primary hover:text-primary transition-colors uppercase tracking-wide"
          >
            VER PRODUCTO
          </Link>
        )}
      </div>
    </div>
  )
}
