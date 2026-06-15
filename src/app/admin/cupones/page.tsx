'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', minAmount: '', maxUses: '', expiresAt: '' })

  useEffect(() => {
    fetch('/api/cupones').then((r) => r.json()).then(setCoupons).catch(() => {})
  }, [])

  async function create() {
    const res = await fetch('/api/cupones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        value: Number(form.value),
        minAmount: form.minAmount ? Number(form.minAmount) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      }),
    })
    const coupon = await res.json()
    setCoupons((prev) => [coupon, ...prev])
    setShowForm(false)
    setForm({ code: '', type: 'percent', value: '', minAmount: '', maxUses: '', expiresAt: '' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Cupones</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 flex items-center gap-2">
          <Plus size={16} /> Nuevo cupón
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-sm uppercase mb-4">Crear cupón</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Código *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field" placeholder="RUGBY10" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Valor *</label>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="input-field" placeholder={form.type === 'percent' ? '10' : '5000'} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Monto mínimo</label>
              <input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Usos máximos</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Vence el</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={create} className="btn-primary text-sm py-2">Crear cupón</button>
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="text-left px-4 py-3">Código</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Valor</th>
              <th className="text-left px-4 py-3">Usos</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Vence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-primary">{c.code}</td>
                <td className="px-4 py-3 text-gray-600">{c.type === 'percent' ? '%' : '$'}</td>
                <td className="px-4 py-3 font-medium">{c.type === 'percent' ? `${c.value}%` : `$${c.value.toLocaleString('es-AR')}`}</td>
                <td className="px-4 py-3 text-gray-500">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-AR') : 'Sin vencimiento'}
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay cupones</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
