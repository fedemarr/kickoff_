'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { EncargoProduct } from '@/types'

interface EncargoCarouselProps {
  products: EncargoProduct[]
}

export function EncargoCarousel({ products }: EncargoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-gray-800 text-white text-xs font-black px-3 py-1 rounded">●</span>
          <h2 className="section-title">ENCARGOS</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/encargos" className="text-sm text-primary font-semibold hover:underline mr-3">
            Ver todos →
          </Link>
          <button onClick={() => scroll('left')} className="p-2 border rounded hover:border-primary hover:text-primary transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 border rounded hover:border-primary hover:text-primary transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/encargos/${p.slug}`}
            className="group min-w-[220px] w-[220px] md:min-w-[240px] md:w-[240px] bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex-shrink-0"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={p.images[0] || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Sin+imagen'}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">ENCARGO</span>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1 tracking-wide">{p.brand}</p>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {p.name}
              </h3>
              {p.season && <p className="text-xs text-gray-400 mt-0.5">Temporada {p.season}</p>}
              <p className="text-xs text-primary font-semibold mt-2">Precio a confirmar →</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
