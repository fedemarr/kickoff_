'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'PREPARING', label: 'Preparando' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [shippingCompany, setShippingCompany] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/ordenes/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d)
        setStatus(d.status)
        setShippingCompany(d.shippingCompany || '')
        setTrackingCode(d.trackingCode || '')
      })
  }, [params.id])

  async function save() {
    setSaving(true)
    await fetch(`/api/ordenes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, shippingCompany, trackingCode }),
    })
    setSaving(false)
  }

  if (!order) return <div className="p-8 text-gray-400">Cargando...</div>

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={16} /> Volver a órdenes
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Orden #{order.orderNumber}</h1>
        <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client info */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-sm uppercase mb-3">Cliente</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Nombre:</span> {order.firstName} {order.lastName}</p>
            <p><span className="font-medium text-gray-800">DNI:</span> {order.dni}</p>
            <p><span className="font-medium text-gray-800">Email:</span> {order.email}</p>
            <p><span className="font-medium text-gray-800">Tel:</span> {order.phone}</p>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-sm uppercase mb-3">Dirección de envío</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.street}</p>
            <p>{order.city}, {order.province}</p>
            <p>CP: {order.zipCode}</p>
            {order.notes && <p className="text-gray-400 italic mt-2">Nota: {order.notes}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-sm uppercase mb-4">Productos</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-gray-100 rounded shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-gray-400">Talle: {item.size} · Cantidad: {item.quantity}</p>
              </div>
              <p className="font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Update status */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-sm uppercase mb-4">Actualizar envío</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Estado</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Empresa de envío</label>
            <select value={shippingCompany} onChange={(e) => setShippingCompany(e.target.value)} className="input-field">
              <option value="">Seleccionar...</option>
              <option>OCA</option>
              <option>Andreani</option>
              <option>Correo Argentino</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">N° de tracking</label>
            <input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} className="input-field" placeholder="Código..." />
          </div>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 px-6">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
