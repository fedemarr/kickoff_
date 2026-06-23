'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const brands = [
  { name: 'Nike',           src: '/brands/nike.png' },
  { name: 'Canterbury',     src: '/brands/canterbury.jpg' },
  { name: 'Gilbert',        src: '/brands/gilbert.png' },
  { name: 'Macron',         src: '/brands/macron.png' },
  { name: 'Le Coq Sportif', src: '/brands/lecoq.png' },
]

// Triplicamos para el loop infinito
const items = [...brands, ...brands, ...brands]

export function BrandsCarousel() {
  return (
    <section className="bg-gray-50 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="section-title text-center">MARCAS OFICIALES</h2>
      </div>
      <div className="flex gap-8 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 shrink-0"
        >
          {items.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="shrink-0 flex items-center justify-center bg-white px-8 py-4 rounded-lg border border-gray-200 min-w-[160px] h-20"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={110}
                height={50}
                className="object-contain max-h-12 grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
