'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { mes: string; ventas: number }[]
}

function formatARS(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E9916" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#1E9916" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatARS} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={55} />
        <Tooltip
          formatter={(v) => [`$${Number(v).toLocaleString('es-AR')}`, 'Ventas']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
        />
        <Area type="monotone" dataKey="ventas" stroke="#1E9916" strokeWidth={2} fill="url(#colorVentas)" dot={{ r: 3, fill: '#1E9916' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
