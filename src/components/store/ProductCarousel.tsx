'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductCarouselProps {
  title: string
  products: Product[]
  viewMoreHref?: string
  badgeColor?: string
}

export function ProductCarousel({ title, products, viewMoreHref, badgeColor = 'bg-primary' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 300
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className={`${badgeColor} text-white text-xs font-black px-3 py-1 rounded`}>●</span>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {viewMoreHref && (
            <Link href={viewMoreHref} className="text-sm text-primary font-semibold hover:underline mr-3">
              Ver más →
            </Link>
          )}
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
          <div key={p.id} className="min-w-[220px] w-[220px] md:min-w-[240px] md:w-[240px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
