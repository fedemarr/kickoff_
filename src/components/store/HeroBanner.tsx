'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark',
    title: 'Camisetas oficiales\nde rugby',
    subtitle: 'La tienda más completa de Argentina',
    cta: 'Ver catálogo',
    href: '/selecciones',
    accent: 'text-primary',
  },
  {
    id: 2,
    bg: 'bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800',
    title: 'Selecciones\nnacionales',
    subtitle: 'Los Pumas · All Blacks · Springboks · Francia y más',
    cta: 'Ver selecciones',
    href: '/selecciones',
    accent: 'text-blue-400',
  },
  {
    id: 3,
    bg: 'bg-gradient-to-br from-primary-dark via-red-900 to-gray-900',
    title: 'SALE\nhasta 30% OFF',
    subtitle: 'Modelos seleccionados con precio especial',
    cta: 'Ver ofertas',
    href: '/sale',
    accent: 'text-yellow-400',
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <div
      className="relative h-[320px] md:h-[500px] overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        {slides.map((slide, i) =>
          i === current ? (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 ${slide.bg} flex items-center justify-center`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10 bg-[url('/pattern-rugby.svg')] bg-repeat" />

              <div className="relative z-10 text-center text-white px-4 max-w-2xl">
                <motion.h1
                  className="text-4xl md:text-6xl font-black uppercase italic leading-tight whitespace-pre-line"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {i === 0 ? <span className={slide.accent}>{line}</span> : ` ${line}`}
                    </span>
                  ))}
                </motion.h1>
                <motion.p
                  className="mt-4 text-lg md:text-xl text-gray-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <Link href={slide.href} className="btn-primary inline-block text-base px-8 py-3">
                    {slide.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-20">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
