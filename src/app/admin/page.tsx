import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import {
  TrendingUp, ShoppingBag, Clock, AlertTriangle,
  Package, XCircle, ClipboardList, ArrowRight,
} from 'lucide-react'
import { RevenueChart } from '@/components/admin/RevenueChart'

async function getDashboardData() {
  try {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [
      totalRevenueAgg,
      monthRevenueAgg,
      totalOrders,
      pendingOrders,
      activeProducts,
      outOfStockCount,
      lowStockVariants,
      recentOrders,
      pendingEncargos,
      monthlyOrdersRaw,
      pendingEncargoCount,
    ] = await Promise.all([
      prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: firstDayOfMonth } }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { active: true } }),
      prisma.productVariant.count({ where: { stock: 0 } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 3 } },
        include: { product: { select: { name: true, category: true } } },
        orderBy: { stock: 'asc' },
        take: 8,
      }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.encargo.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID', createdAt: { gte: sixMonthsAgo } },
        select: { total: true, createdAt: true },
      }),
      prisma.encargo.count({ where: { status: 'PENDING' } }),
    ])

    // Build last 6 months chart data
    const monthMap: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' })
      monthMap[key] = 0
    }
    for (const order of monthlyOrdersRaw) {
      const key = new Date(order.createdAt).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' })
      if (key in monthMap) monthMap[key] = (monthMap[key] || 0) + order.total
    }
    const chartData = Object.entries(monthMap).map(([mes, ventas]) => ({ mes, ventas }))

    return {
      totalRevenue: totalRevenueAgg._sum.total ?? 0,
      monthRevenue: monthRevenueAgg._sum.total ?? 0,
      totalOrders,
      pendingOrders,
      activeProducts,
      outOfStockCount,
      lowStockVariants,
      recentOrders,
      pendingEncargos,
      chartData,
      pendingEncargoCount,
    }
  } catch {
    return {
      totalRevenue: 0, monthRevenue: 0, totalOrders: 0, pendingOrders: 0,
      activeProducts: 0, outOfStockCount: 0, lowStockVariants: [], recentOrders: [],
      pendingEncargos: [], chartData: [], pendingEncargoCount: 0,
    }
  }
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', CONFIRMED: 'Confirmado', PREPARING: 'Preparando',
  SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
}
const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
}
const ENCARGO_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONTACTED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-purple-100 text-purple-700', ORDERED: 'bg-indigo-100 text-indigo-700',
  ARRIVED: 'bg-teal-100 text-teal-700', DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function AdminDashboard() {
  const {
    totalRevenue, monthRevenue, totalOrders, pendingOrders,
    activeProducts, outOfStockCount, lowStockVariants, recentOrders,
    pendingEncargos, chartData, pendingEncargoCount,
  } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Dashboard</h1>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* KPIs — row 1: revenue & orders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Ventas totales</span>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">Ingresos acumulados</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Este mes</span>
            <TrendingUp size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-black text-gray-900">{formatPrice(monthRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">Ventas del mes actual</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Órdenes totales</span>
            <ShoppingBag size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{totalOrders}</p>
          <p className="text-xs text-gray-400 mt-1">Todos los pedidos</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Pendientes</span>
            <Clock size={16} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{pendingOrders}</p>
          <p className="text-xs text-gray-400 mt-1">Órdenes sin confirmar</p>
        </div>
      </div>

      {/* KPIs — row 2: products & encargos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Productos</span>
            <Package size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{activeProducts}</p>
          <p className="text-xs text-gray-400 mt-1">Productos activos</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Sin stock</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{outOfStockCount}</p>
          <p className="text-xs text-gray-400 mt-1">Variantes agotadas</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Stock bajo</span>
            <AlertTriangle size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{lowStockVariants.length}</p>
          <p className="text-xs text-gray-400 mt-1">Variantes con ≤ 3 unidades</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Encargos</span>
            <ClipboardList size={16} className="text-teal-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{pendingEncargoCount}</p>
          <p className="text-xs text-gray-400 mt-1">Encargos pendientes</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-sm uppercase tracking-wide mb-4">Ventas últimos 6 meses</h2>
        <RevenueChart data={chartData} />
      </div>

      {/* Orders + Encargos */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-sm uppercase tracking-wide">Últimas órdenes</h2>
            <Link href="/admin/ordenes" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                  <th className="text-left px-5 py-3">N° Orden</th>
                  <th className="text-left px-5 py-3">Cliente</th>
                  <th className="text-left px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Estado</th>
                  <th className="text-left px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recentOrders as any[]).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/ordenes/${order.id}`} className="font-mono text-xs text-primary hover:underline">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-sm">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-sm">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">No hay órdenes todavía</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending encargos */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-sm uppercase tracking-wide">Encargos pendientes</h2>
            <Link href="/admin/encargos" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(pendingEncargos as any[]).map((e) => (
              <div key={e.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{e.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.name} · Talle {e.size}</p>
                    <p className="text-xs text-gray-400">{e.ventana}</p>
                  </div>
                  <a
                    href={`https://wa.me/${e.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    WA
                  </a>
                </div>
              </div>
            ))}
            {pendingEncargos.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No hay encargos pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Low stock */}
      {lowStockVariants.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-500" />
              Stock bajo / Sin stock
            </h2>
            <Link href="/admin/stock" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todo <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                  <th className="text-left px-5 py-3">Producto</th>
                  <th className="text-left px-5 py-3">Categoría</th>
                  <th className="text-left px-5 py-3">Talle</th>
                  <th className="text-left px-5 py-3">Color</th>
                  <th className="text-left px-5 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(lowStockVariants as any[]).map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium">{v.product.name}</td>
                    <td className="px-5 py-3 text-xs text-gray-400 capitalize">{v.product.category.toLowerCase()}</td>
                    <td className="px-5 py-3 font-bold">{v.size}</td>
                    <td className="px-5 py-3 text-gray-500">{v.color || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {v.stock === 0 ? 'Sin stock' : `${v.stock} unid.`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
