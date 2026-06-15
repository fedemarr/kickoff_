'use client'
import { useState } from 'react'
import { VentanaStatus } from './VentanaStatus'
import { HowItWorks } from './HowItWorks'
import { EncargoCard } from './EncargoCard'
import { EncargoModal } from './EncargoModal'
import { WaitlistForm } from './WaitlistForm'
import type { EncargoProduct, VentanaEncargo } from '@/types'

interface EncargosClientProps {
  products: EncargoProduct[]
  ventana: VentanaEncargo
  encargoWhatsapp: string
  legalText: string
  deliveryTime: string
}

export function EncargosClient({ products, ventana, encargoWhatsapp, legalText, deliveryTime }: EncargosClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<EncargoProduct | null>(null)

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-[#111] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Sistema de pedidos especiales</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic mb-4">ENCARGOS</h1>
          <p className="text-gray-400 text-lg mb-8">Pedí tu camiseta favorita y la conseguimos para vos</p>
          <VentanaStatus ventana={ventana} />
          {!ventana.isOpen && (
            <div className="mt-6">
              <WaitlistForm proximaApertura={ventana.proximaApertura} />
            </div>
          )}
        </div>
      </div>

      <HowItWorks />

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="section-title mb-6">CATÁLOGO DE ENCARGOS</h2>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>El catálogo de encargos estará disponible pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <EncargoCard
                key={p.id}
                product={p}
                ventana={ventana}
                onEncargar={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {/* Legal note */}
        {legalText && (
          <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <p className="text-sm text-yellow-800 leading-relaxed">⚠️ {legalText}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <EncargoModal
          product={selectedProduct}
          ventana={ventana}
          encargoWhatsapp={encargoWhatsapp}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
