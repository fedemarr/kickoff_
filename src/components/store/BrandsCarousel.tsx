'use client'
import { motion } from 'framer-motion'

const brands = ['Adidas', 'Canterbury', 'Nike', 'Gilbert', 'Macron', 'Le Coq Sportif']

export function BrandsCarousel() {
  return (
    <section className="bg-gray-50 py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="section-title text-center">MARCAS OFICIALES</h2>
      </div>
      <div className="flex gap-8 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 shrink-0"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="shrink-0 flex items-center justify-center bg-white px-8 py-4 rounded-lg border border-gray-200 min-w-[160px] text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="font-black text-lg uppercase tracking-wider">{brand}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
