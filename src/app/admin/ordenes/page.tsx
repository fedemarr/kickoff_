import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente', CONFIRMED: 'Confirmado', PREPARING: 'Preparando',
  SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
}
const PAYMENT_LABELS: Record<string, string> = { MERCADOPAGO: 'MercadoPago', TRANSFER: 'Transferencia', CASH: 'Efectivo' }

export default async function AdminOrdersPage() {
  let orders: any[] = []
  try {
    orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Órdenes</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="text-left px-4 py-3">N° Orden</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Pago</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">#{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.firstName} {order.lastName}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                <td className="px-4 py-3 font-bold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{PAYMENT_LABELS[order.paymentMethod]}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || ''}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/ordenes/${order.id}`} className="text-xs text-primary hover:underline">Ver →</Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No hay órdenes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
