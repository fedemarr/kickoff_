'use client'
import type { ProductVariant } from '@/types'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selected: string | null
  onSelect: (size: string) => void
  error?: boolean
}

export function SizeSelector({ variants, selected, onSelect, error }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Talle</span>
        {error && <span className="text-xs text-primary">Seleccioná un talle</span>}
      </div>
      <div className={`flex flex-wrap gap-2 ${error ? 'animate-shake' : ''}`}>
        {variants.map((v) => {
          const outOfStock = v.stock === 0
          const isSelected = selected === v.size

          return (
            <button
              key={v.id}
              disabled={outOfStock}
              onClick={() => !outOfStock && onSelect(v.size)}
              className={`relative min-w-[48px] h-10 px-3 rounded text-sm font-semibold transition-all ${
                outOfStock
                  ? 'border border-dashed border-red-300 text-gray-300 cursor-not-allowed line-through'
                  : isSelected
                  ? 'border-2 border-primary bg-primary/10 text-primary'
                  : 'border border-gray-300 hover:border-gray-800 text-gray-700'
              }`}
            >
              {v.size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
