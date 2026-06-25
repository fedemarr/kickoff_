'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, CheckCircle, Package, Truck, MapPin, MessageCircle } from 'lucide-react'

const STATUS_FLOW = [
  { value: 'PENDING',   label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  { value: 'CONFIRMED', label: 'Confirmado',  color: 'bg-blue-100 text-blue-700' },
  { value: 'PREPARING', label: 'Preparando',  color: 'bg-purple-100 text-purple-700' },
  { value: 'SHIPPED',   label: 'En camino',   color: 'bg-indigo-100 text-indigo-700' },
  { value: 'DELIVERED', label: 'Entregado',   color: 'bg-green-100 text-green-700' },
  { value: 'CANCELLED', label: 'Cancelado',   color: 'bg-red-100 text-red-700' },
]

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  PENDING:  { label: 'Pago pendiente',    color: 'bg-yellow-100 text-yellow-700' },
  PAID:     { label: 'Pago confirmado',   color: 'bg-green-100 text-green-700' },
  FAILED:   { label: 'Pago rechazado',    color: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Reembolsado',       color: 'bg-gray-100 text-gray-600' },
}

const PAYMENT_LABELS: Record<string, string> = {
  MERCADOPAGO: 'MercadoPago', TRANSFER: 'Transferencia', CASH: 'Efectivo',
}

const SHIPPING_COMPANIES = ['Via Cargo', 'OCA', 'Andreani', 'Correo Argentino', 'Otro']

function trackingUrl(company: string, code: string) {
  if (!code) return null
  if (company === 'Via Cargo') return `https://www.viacargo.com.ar/seguimiento/?nro=${code}`
  if (company === 'OCA') return `https://www.oca.com.ar/seguimiento-de-envios/?id=${code}`
  if (company === 'Andreani') return `https://www.andreani.com/#!/informacionEnvio/${code}`
  return null
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [shippingCompany, setShippingCompany] = useState('')
  const [trackingCode, setTrackingCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/ordenes/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d)
        setStatus(d.status)
        setPaymentStatus(d.paymentStatus)
        setShippingCompany(d.shippingCompany || 'Via Cargo')
        setTrackingCode(d.trackingCode || '')
      })
  }, [params.id])

  async function save(overrides?: Partial<{ status: string; paymentStatus: string; shippingCompany: string; trackingCode: string }>) {
    setSaving(true)
    const body = {
      status: overrides?.status ?? status,
      paymentStatus: overrides?.paymentStatus ?? paymentStatus,
      shippingCompany: overrides?.shippingCompany ?? shippingCompany,
      trackingCode: overrides?.trackingCode ?? trackingCode,
    }
    const res = await fetch(`/api/ordenes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const updated = await res.json()
    setOrder(updated)
    setStatus(updated.status)
    setPaymentStatus(updated.paymentStatus)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function quickAction(newStatus: string) {
    setStatus(newStatus)
    await save({ status: newStatus })
  }

  async function confirmPayment() {
    setPaymentStatus('PAID')
    const newStatus = status === 'PENDING' ? 'CONFIRMED' : status
    setStatus(newStatus)
    await save({ paymentStatus: 'PAID', status: newStatus })
  }

  if (!order) return <div className="p-8 text-gray-400">Cargando...</div>

  const currentStatusObj = STATUS_FLOW.find(s => s.value === status)
  const paymentStatusObj = PAYMENT_STATUS[paymentStatus] ?? PAYMENT_STATUS.PENDING
  const waLink = `https://wa.me/${order.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.firstName}! Te escribimos de KickOff sobre tu pedido #${order.orderNumber}.`)}`
  const trackUrl = trackingUrl(shippingCompany, trackingCode)

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={16} /> Volver a órdenes
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Orden #{order.orderNumber}</h1>
          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${currentStatusObj?.color}`}>
            {currentStatusObj?.label}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${paymentStatusObj.color}`}>
            {paymentStatusObj.label}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-sm uppercase mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-2">
          {paymentStatus !== 'PAID' && (
            <button onClick={confirmPayment} disabled={saving}
              className="flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle size={15} /> Confirmar pago
            </button>
          )}
          {status !== 'PREPARING' && status !== 'SHIPPED' && status !== 'DELIVERED' && status !== 'CANCELLED' && (
            <button onClick={() => quickAction('PREPARING')} disabled={saving}
              className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Package size={15} /> Preparando envío
            </button>
          )}
          {status !== 'SHIPPED' && status !== 'DELIVERED' && status !== 'CANCELLED' && (
            <button onClick={() => quickAction('SHIPPED')} disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              <Truck size={15} /> Envío en camino
            </button>
          )}
          {status !== 'DELIVERED' && status !== 'CANCELLED' && (
            <button onClick={() => quickAction('DELIVERED')} disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              <MapPin size={15} /> Entregado
            </button>
          )}
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#20b857] transition-colors">
            <MessageCircle size={15} /> WhatsApp cliente
          </a>
        </div>
        {saved && <p className="text-green-600 text-xs mt-3 font-medium">✓ Guardado correctamente</p>}
      </div>

      {/* Client + address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-sm uppercase mb-3">Cliente</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Nombre:</span> {order.firstName} {order.lastName}</p>
            <p><span className="font-medium text-gray-800">DNI:</span> {order.dni}</p>
            <p><span className="font-medium text-gray-800">Email:</span> {order.email}</p>
            <p><span className="font-medium text-gray-800">Tel:</span> {order.phone}</p>
            <p><span className="font-medium text-gray-800">Pago:</span> {PAYMENT_LABELS[order.paymentMethod]}</p>
          </div>
        </div>
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

      {/* Shipping details */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-sm uppercase mb-4">Datos de envío</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Empresa</label>
            <select value={shippingCompany} onChange={(e) => setShippingCompany(e.target.value)} className="input-field">
              <option value="">Seleccionar...</option>
              {SHIPPING_COMPANIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">N° de tracking</label>
            <input value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)}
              className="input-field" placeholder="Código de seguimiento..." />
          </div>
        </div>
        {trackUrl && (
          <a href={trackUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-4">
            <Truck size={14} /> Seguir envío en {shippingCompany} →
          </a>
        )}
        <div className="flex items-center gap-3">
          <button onClick={() => save()} disabled={saving} className="btn-primary text-sm py-2 px-6">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Guardado</span>}
        </div>
      </div>
    </div>
  )
}
