'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/stores/cartStore'
import { getVentanaEncargo } from '@/lib/encargos'

export function Navbar() {
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [compraOpen, setCompraOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ventana = getVentanaEncargo()
  const count = itemCount()

  const compraLinks = [
    { href: '/selecciones', label: 'Selecciones' },
    { href: '/clubes', label: 'Clubes' },
    { href: '/equipamiento', label: 'Equipamiento' },
    { href: '/sale', label: 'Sale' },
  ]

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setCompraOpen(true)
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setCompraOpen(false), 250)
  }

  return (
    <header className="bg-[#111] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-[60px] gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 mr-4">
            <Image
              src="/logo.jpg"
              alt="KickOff Rugby"
              width={48}
              height={48}
              className="rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
            <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white' : ''}`}>
              INICIO
            </Link>

            <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
              <button className={`flex items-center gap-1 hover:text-white transition-colors ${compraOpen ? 'text-white' : ''}`}>
                COMPRÁ YA
                <motion.span animate={{ rotate: compraOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {compraOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 bg-white text-gray-800 rounded-lg shadow-2xl min-w-[180px] py-2 mt-2 z-50 border border-gray-100"
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                  >
                    {compraLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setCompraOpen(false)}
                        className="flex items-center px-4 py-3 text-sm hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/encargos" className="flex items-center gap-1.5 hover:text-white transition-colors">
              ENCARGOS
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${ventana.isOpen ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>
                {ventana.isOpen ? 'ABIERTO' : 'CERRADO'}
              </span>
            </Link>

            <Link href="/ayuda" className="hover:text-white transition-colors">AYUDA</Link>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:block ml-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#222] text-white placeholder-gray-400 pl-9 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Cart */}
          <button onClick={toggleCart} className="relative text-white hover:text-primary transition-colors ml-2 shrink-0" aria-label="Carrito">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white ml-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-700 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                <Link href="/" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm font-semibold">INICIO</Link>
                {compraLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm font-semibold pl-4">
                    {l.label}
                  </Link>
                ))}
                <Link href="/encargos" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm font-semibold">
                  ENCARGOS {ventana.isOpen ? '🟢' : '🔴'}
                </Link>
                <Link href="/ayuda" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm font-semibold">AYUDA</Link>
                <div className="pt-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="w-full bg-[#222] text-white placeholder-gray-400 pl-9 pr-4 py-2 rounded text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
