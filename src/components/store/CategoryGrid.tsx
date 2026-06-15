import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { label: 'SELECCIONES', href: '/selecciones', img: '/selecciones.jpg' },
  { label: 'CLUBES', href: '/clubes', img: '/clubes.jpg' },
  { label: 'EQUIPAMIENTO', href: '/equipamiento', img: '/equipamiento.png' },
  { label: 'SALE', href: '/sale', img: '/descuentos.jpg' },
  { label: 'ENCARGOS', href: '/encargos', img: '/encargos.png' },
]

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="section-title mb-6">CATEGORÍAS</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map(({ label, href, img }) => (
          <Link
            key={href}
            href={href}
            className="relative rounded-lg overflow-hidden aspect-square flex items-end group"
          >
            <Image
              src={img}
              alt={label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />
            <div className="relative z-10 p-4">
              <p className="text-white font-black text-sm uppercase tracking-wider drop-shadow">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
