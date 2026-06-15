import Link from 'next/link'

const categories = [
  { label: 'SELECCIONES', href: '/selecciones', color: 'from-blue-900 to-gray-900', emoji: '🌍' },
  { label: 'CLUBES', href: '/clubes', color: 'from-purple-900 to-gray-900', emoji: '🏉' },
  { label: 'EQUIPAMIENTO', href: '/equipamiento', color: 'from-green-900 to-gray-900', emoji: '⚙️' },
  { label: 'SALE', href: '/sale', color: 'from-red-900 to-primary-dark', emoji: '🔥' },
  { label: 'ENCARGOS', href: '/encargos', color: 'from-amber-900 to-gray-900', emoji: '📦' },
]

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="section-title mb-6">CATEGORÍAS</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map(({ label, href, color, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`relative bg-gradient-to-br ${color} rounded-lg overflow-hidden aspect-square flex items-end p-4 group`}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="relative z-10">
              <div className="text-3xl mb-2">{emoji}</div>
              <p className="text-white font-black text-sm uppercase tracking-wider">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
