'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import { buildWhatsAppMessage, getWhatsAppLink } from '@/lib/whatsapp'
import { getVentanaLabel } from '@/lib/encargos'
import type { EncargoProduct, VentanaEncargo } from '@/types'

interface EncargoModalProps {
  product: EncargoProduct
  ventana: VentanaEncargo
  encargoWhatsapp: string
  onClose: () => void
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

export function EncargoModal({ product, ventana, encargoWhatsapp, onClose }: EncargoModalProps) {
  const [size, setSize] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!size || !name || !phone) return
    setLoading(true)

    await fetch('/api/encargos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, size, name, phone, email, notes }),
    }).catch(() => {})

    const ventanaLabel = getVentanaLabel(ventana)
    const msg = buildWhatsAppMessage({
      productName: product.name,
      brand: product.brand,
      size,
      name,
      phone,
      email,
      notes,
      ventana: ventanaLabel,
    })

    const waLink = getWhatsAppLink(encargoWhatsapp || '5491100000000', msg)
    window.open(waLink, '_blank')
    setSent(true)
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">Solicitar encargo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-2">¡Encargo enviado!</h3>
              <p className="text-sm text-gray-500">Revisá tu WhatsApp y mandanos el mensaje para confirmar.</p>
              <p className="text-xs text-gray-400 mt-2">Te respondemos en menos de 24hs.</p>
              <button onClick={onClose} className="btn-primary mt-4 text-sm">Cerrar</button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-3 mb-5">
                <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-400">{product.brand} · {product.season}</p>
              </div>

              <div className="space-y-4">
                {/* Size selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Talle *</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                          size === s ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tu nombre *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Nombre completo" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp *</label>
                  <div className="flex gap-2">
                    <span className="input-field w-14 bg-gray-50 text-gray-500 text-center shrink-0">+54</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field flex-1" placeholder="Número sin el 54" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email (opcional)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Aclaraciones (color, versión...)</label>
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Ej: versión local, color azul..." />
                </div>

                <button
                  onClick={handleSend}
                  disabled={!size || !name || !phone || loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded uppercase tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <MessageCircle size={18} />
                  ENVIAR ENCARGO POR WHATSAPP →
                </button>

                <p className="text-xs text-center text-gray-400">⚡ Te respondemos en menos de 24hs</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
