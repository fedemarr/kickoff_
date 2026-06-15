import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Package, ShoppingBag, Users, AlertTriangle } from 'lucide-react'

async function getDashboardData() {
  try {
    const [
      totalOrders,
      paidOrders,
      activeProducts,
      lowStockCount,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
      prisma.product.count({ where: { active: true } }),
      prisma.productVariant.count({ where: { stock: { lte: 3, gt: 0 } } }),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return { totalOrders, monthRevenue: paidOrders._sum.total ?? 0, activeProducts, lowStockCount, recentOrders }
  } catch {
    return { totalOrders: 0, monthRevenue: 0, activeProducts: 0, lowStockCount: 0, recentOrders: [] }
  }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function AdminDashboard() {
  const { totalOrders, monthRevenue, activeProducts, lowStockCount, recentOrders } = await getDashboardData()

  const metrics = [
    { label: 'Ventas totales', value: formatPrice(monthRevenue), icon: Package, color: 'text-green-600' },
    { label: 'Órdenes totales', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Productos activos', value: activeProducts, icon: Users, color: 'text-purple-600' },
    { label: 'Stock bajo', value: `${lowStockCount} alertas`, icon: AlertTriangle, color: 'text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-sm uppercase tracking-wide">Últimas órdenes</h2>
          <Link href="/admin/ordenes" className="text-xs text-primary hover:underline">Ver todas →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-5 py-3">N° Orden</th>
                <th className="text-left px-5 py-3">Cliente</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Estado</th>
                <th className="text-left px-5 py-3">Fecha</th>
                <th className="text-left px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(recentOrders as any[]).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">#{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-bold">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/ordenes/${order.id}`} className="text-xs text-primary hover:underline">
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No hay órdenes todavía</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
