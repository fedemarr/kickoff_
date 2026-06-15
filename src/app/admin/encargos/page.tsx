'use client'
import { useEffect, useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONTACTED', label: 'Contactado' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'ORDERED', label: 'Pedido hecho' },
  { value: 'ARRIVED', label: 'Llegó' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-purple-100 text-purple-700',
  ORDERED: 'bg-indigo-100 text-indigo-700',
  ARRIVED: 'bg-teal-100 text-teal-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminEncargosPage() {
  const [encargos, setEncargos] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/encargos').then((r) => r.json()).then(setEncargos).catch(() => {})
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/encargos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setEncargos((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
  }

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Encargos</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="text-left px-4 py-3">Producto</th>
              <th className="text-left px-4 py-3">Talle</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">WhatsApp</th>
              <th className="text-left px-4 py-3">Ventana</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {encargos.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-sm line-clamp-1">{e.productName}</p>
                  <p className="text-xs text-gray-400">{e.brand}</p>
                </td>
                <td className="px-4 py-3 font-bold">{e.size}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{e.name}</p>
                  {e.email && <p className="text-xs text-gray-400">{e.email}</p>}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://wa.me/${e.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-xs"
                  >
                    {e.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{e.ventana}</td>
                <td className="px-4 py-3">
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[e.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(e.createdAt).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://wa.me/${e.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
            {encargos.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No hay encargos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
