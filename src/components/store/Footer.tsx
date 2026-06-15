import Link from 'next/link'
import { Mail } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#111] text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-white font-black text-2xl mb-3">KICK<span className="text-primary">OFF</span></h2>
            <p className="text-sm leading-relaxed">La tienda de rugby más completa de Argentina. Camisetas oficiales de selecciones y clubes.</p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">Tienda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/selecciones" className="hover:text-white transition-colors">Selecciones</Link></li>
              <li><Link href="/clubes" className="hover:text-white transition-colors">Clubes</Link></li>
              <li><Link href="/equipamiento" className="hover:text-white transition-colors">Equipamiento</Link></li>
              <li><Link href="/sale" className="hover:text-white transition-colors">Sale</Link></li>
              <li><Link href="/encargos" className="hover:text-white transition-colors">Encargos</Link></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">Información</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ayuda" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/envios" className="hover:text-white transition-colors">Política de envíos</Link></li>
              <li><Link href="/devoluciones" className="hover:text-white transition-colors">Cambios y devoluciones</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase mb-4 tracking-wide">Contacto</h3>
            <div className="space-y-3 text-sm">
              <a href="https://instagram.com/kickoff.tienda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="text-base">📸</span> @kickoff.tienda
              </a>
              <a href="mailto:kickoff@tienda.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} /> kickoff@tienda.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {year} KickOff. Todos los derechos reservados. · Hecho con ❤️ para el rugby argentino
        </div>
      </div>
    </footer>
  )
}
