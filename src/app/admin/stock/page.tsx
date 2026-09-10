'use client'
import { useEffect, useState } from 'react'

export default function AdminStockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function loadProducts() {
    const r = await fetch('/api/productos?all=true', { cache: 'no-store' })
    const data = await r.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { loadProducts() }, [])

  function setStock(variantId: string, val: string) {
    setChanges((prev) => ({ ...prev, [variantId]: val }))
  }

  async function saveAll() {
    setSaving(true)
    setError('')
    const entries = Object.entries(changes)
    const failed: string[] = []
    const okIds: string[] = []

    for (const [variantId, raw] of entries) {
      const stock = Math.trunc(Number(raw))
      if (!Number.isFinite(stock) || stock < 0) {
        failed.push(variantId)
        continue
      }
      try {
        const res = await fetch(`/api/productos/variante/${variantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock }),
        })
        if (!res.ok) {
          failed.push(variantId)
        } else {
          okIds.push(variantId)
        }
      } catch {
        failed.push(variantId)
      }
    }

    // Optimistic update so the UI reflects saved values even if the refetch lags
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variants: p.variants.map((v: any) =>
          okIds.includes(v.id) ? { ...v, stock: Math.trunc(Number(changes[v.id])) } : v
        ),
      }))
    )

    // Keep only the failed edits so the user can retry them
    const remaining: Record<string, string> = {}
    for (const id of failed) remaining[id] = changes[id]
    setChanges(remaining)

    try {
      await loadProducts()
    } catch {
      /* keep optimistic values */
    }

    setSaving(false)

    if (failed.length > 0) {
      setError(`No se pudieron guardar ${failed.length} cambio(s). Revisá los valores e intentá de nuevo.`)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Control de Stock</h1>
        <div className="flex items-center gap-3">
          {Object.keys(changes).length > 0 && (
            <button onClick={saveAll} disabled={saving} className="btn-primary text-sm py-2">
              {saving ? 'Guardando...' : `Guardar ${Object.keys(changes).length} cambios`}
            </button>
          )}
          {saved && <span className="text-sm text-green-600 font-medium">✓ Cambios guardados</span>}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-sm mb-4">
              {product.name} <span className="text-gray-400 font-normal">· {product.brand}</span>
              {!product.active && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Inactivo</span>
              )}
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v: any) => {
                const raw = changes[v.id] !== undefined ? changes[v.id] : String(v.stock)
                const num = Number(raw)
                const color = num === 0 ? 'border-red-300 bg-red-50' : num <= 3 ? 'border-orange-300 bg-orange-50' : 'border-green-200 bg-green-50'

                return (
                  <div key={v.id} className={`flex flex-col items-center gap-1 border-2 rounded-lg p-3 min-w-[80px] ${color}`}>
                    <span className="text-xs font-bold text-gray-700">{v.size}</span>
                    <input
                      type="number"
                      min="0"
                      value={raw}
                      onChange={(e) => setStock(v.id, e.target.value)}
                      className="w-14 text-center text-sm font-bold border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-primary"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
