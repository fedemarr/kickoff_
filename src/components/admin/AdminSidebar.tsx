'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, ShoppingBag, BarChart2, Users,
  Tag, Settings, ExternalLink, LogOut, Clock
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag },
  { href: '/admin/stock', label: 'Stock', icon: BarChart2 },
  { href: '/admin/encargos', label: 'Encargos', icon: Clock },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/cupones', label: 'Cupones', icon: Tag },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#111] text-gray-300 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <h1 className="font-black text-white text-lg">
          KICK<span className="text-primary">OFF</span>
          <span className="text-xs font-normal text-gray-500 ml-2">Admin</span>
        </h1>
        <div className="w-8 h-0.5 bg-primary mt-1" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/20 text-white border-r-2 border-primary'
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors">
          <ExternalLink size={14} /> Ver tienda
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors w-full"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
