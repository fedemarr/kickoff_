'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const displayImages = images.length > 0 ? images : ['https://placehold.co/600x600/f3f4f6/9ca3af?text=Sin+imagen']

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-3">
        <Image
          src={displayImages[active]}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                i === active ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
