'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const brands = ['Adidas', 'Canterbury', 'Nike', 'Gilbert', 'Macron', 'Le Coq Sportif']
const priceRanges = [
  { label: 'Menos de $70.000', value: '0-70000' },
  { label: '$70.000 a $100.000', value: '70000-100000' },
  { label: 'Más de $100.000', value: '100000-' },
]
const SELECCIONES_SUB = ['Los Pumas', 'All Blacks', 'Springboks', 'Inglaterra', 'Francia', 'Irlanda', 'Gales']

interface FilterSidebarProps {
  category?: string
}

export function FilterSidebar({ category }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const activeBrand = searchParams.get('marca')
  const activePrice = searchParams.get('precio')

  return (
    <aside className="w-full md:w-56 shrink-0">
      {/* Marcas */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">Marcas</h3>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => updateParam('marca', activeBrand === b ? null : b)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                activeBrand === b
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-400 text-gray-600'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">Precio</h3>
        <div className="space-y-2">
          {priceRanges.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="precio"
                checked={activePrice === value}
                onChange={() => updateParam('precio', activePrice === value ? null : value)}
                className="accent-primary"
              />
              <span className={`text-sm transition-colors ${activePrice === value ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub-categories for Selecciones */}
      {category === 'SELECCIONES' && (
        <div className="mb-6">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">Selección</h3>
          <div className="space-y-1.5">
            {SELECCIONES_SUB.map((sel) => {
              const activeSubcat = searchParams.get('seleccion')
              return (
                <label key={sel} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeSubcat === sel}
                    onChange={() => updateParam('seleccion', activeSubcat === sel ? null : sel)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-900">{sel}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {(activeBrand || activePrice) && (
        <button
          onClick={() => {
            const params = new URLSearchParams()
            router.push(`${pathname}?${params.toString()}`)
          }}
          className="text-xs text-primary hover:underline font-medium"
        >
          Limpiar filtros ×
        </button>
      )}
    </aside>
  )
}
