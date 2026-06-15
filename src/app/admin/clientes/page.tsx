import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

export default async function AdminClientesPage() {
  let clients: any[] = []
  try {
    const orders = await prisma.order.findMany({
      select: { email: true, firstName: true, lastName: true, total: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    // Group by email
    const map = new Map<string, any>()
    for (const o of orders) {
      if (!map.has(o.email)) {
        map.set(o.email, { email: o.email, name: `${o.firstName} ${o.lastName}`, orders: 0, total: 0, lastOrder: o.createdAt })
      }
      const c = map.get(o.email)!
      c.orders++
      c.total += o.total
    }
    clients = Array.from(map.values())
  } catch {}

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Clientes</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Órdenes</th>
              <th className="text-left px-4 py-3">Total gastado</th>
              <th className="text-left px-4 py-3">Última compra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((c) => (
              <tr key={c.email} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-center">{c.orders}</td>
                <td className="px-4 py-3 font-bold text-primary">{formatPrice(c.total)}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.lastOrder).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay clientes todavía</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
