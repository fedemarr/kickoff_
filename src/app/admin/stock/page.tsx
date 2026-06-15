'use client'
import { useEffect, useState } from 'react'

export default function AdminStockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [changes, setChanges] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/productos')
      .then((r) => r.json())
      .then(setProducts)
  }, [])

  function setStock(variantId: string, val: number) {
    setChanges((prev) => ({ ...prev, [variantId]: val }))
  }

  async function saveAll() {
    setSaving(true)
    const entries = Object.entries(changes)
    for (const [variantId, stock] of entries) {
      await fetch(`/api/productos/variante/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      })
    }
    setSaving(false)
    setSaved(true)
    setChanges({})
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Control de Stock</h1>
        {Object.keys(changes).length > 0 && (
          <button onClick={saveAll} disabled={saving} className="btn-primary text-sm py-2">
            {saving ? 'Guardando...' : `Guardar ${Object.keys(changes).length} cambios`}
          </button>
        )}
        {saved && <span className="text-sm text-green-600 font-medium">✓ Cambios guardados</span>}
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-sm mb-4">{product.name} <span className="text-gray-400 font-normal">· {product.brand}</span></h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v: any) => {
                const currentStock = changes[v.id] !== undefined ? changes[v.id] : v.stock
                const color = currentStock === 0 ? 'border-red-300 bg-red-50' : currentStock <= 3 ? 'border-orange-300 bg-orange-50' : 'border-green-200 bg-green-50'

                return (
                  <div key={v.id} className={`flex flex-col items-center gap-1 border-2 rounded-lg p-3 min-w-[80px] ${color}`}>
                    <span className="text-xs font-bold text-gray-700">{v.size}</span>
                    <input
                      type="number"
                      min="0"
                      value={currentStock}
                      onChange={(e) => setStock(v.id, Number(e.target.value))}
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
