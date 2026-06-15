'use client'
import Image from 'next/image'
import Link from 'next/link'
import type { EncargoProduct, VentanaEncargo } from '@/types'

interface EncargoCardProps {
  product: EncargoProduct
  ventana: VentanaEncargo
  onEncargar: (product: EncargoProduct) => void
}

export function EncargoCard({ product, ventana, onEncargar }: EncargoCardProps) {
  const mainImage = product.images[0] || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Sin+imagen'

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
      <Link href={`/encargos/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">ENCARGO</span>
        </div>
      </Link>

      <div className="p-3">
        <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">{product.brand}</p>
        <Link href={`/encargos/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.season && (
          <p className="text-xs text-gray-400 mt-0.5">Temporada {product.season}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Precio a confirmar</p>

        {ventana.isOpen ? (
          <button
            onClick={() => onEncargar(product)}
            className="mt-3 w-full text-sm font-semibold py-2 rounded bg-primary text-white hover:bg-primary-dark transition-colors uppercase tracking-wide"
          >
            ENCARGAR
          </button>
        ) : (
          <div className="mt-3 relative group/btn">
            <button
              disabled
              className="w-full text-sm font-semibold py-2 rounded bg-gray-200 text-gray-400 cursor-not-allowed uppercase tracking-wide"
            >
              ENCARGAR
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
              Los encargos abren {ventana.proximaApertura}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
