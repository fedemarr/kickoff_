'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EncargoModal } from './EncargoModal'
import { VentanaStatus } from './VentanaStatus'
import type { EncargoProduct, VentanaEncargo } from '@/types'

interface Props {
  product: EncargoProduct
  ventana: VentanaEncargo
  encargoWhatsapp: string
}

export function EncargoDetailClient({ product, ventana, encargoWhatsapp }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const images = product.images.length > 0 ? product.images : ['https://placehold.co/600x600/f3f4f6/9ca3af?text=Encargo']

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/">Inicio</Link> / <Link href="/encargos">Encargos</Link> / <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-3">
            <Image src={images[activeImage]} alt={product.name} fill className="object-cover" priority />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative aspect-square rounded overflow-hidden border-2 ${i === activeImage ? 'border-primary' : 'border-gray-200'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">{product.brand}</p>
          <h1 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h1>
          {product.season && <p className="text-gray-400 text-sm mb-2">Temporada {product.season}</p>}
          {product.nation && <p className="text-sm text-gray-600 mb-4">Selección: <span className="font-medium">{product.nation}</span></p>}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-yellow-800 font-medium">Precio a confirmar según cotización del dólar</p>
          </div>

          <div className="mb-6">
            <VentanaStatus ventana={ventana} />
          </div>

          {ventana.isOpen ? (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              📦 SOLICITAR ENCARGO
            </button>
          ) : (
            <button disabled className="w-full py-4 text-base bg-gray-200 text-gray-400 rounded font-bold uppercase cursor-not-allowed">
              ENCARGOS CERRADOS
            </button>
          )}

          {product.description && (
            <div className="mt-8 border-t pt-6">
              <h2 className="font-bold text-sm uppercase mb-3">Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <EncargoModal
          product={product}
          ventana={ventana}
          encargoWhatsapp={encargoWhatsapp}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
