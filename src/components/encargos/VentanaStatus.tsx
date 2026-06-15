'use client'
import { useState, useEffect } from 'react'
import type { VentanaEncargo } from '@/types'

interface VentanaStatusProps {
  ventana: VentanaEncargo
}

function CountdownTimer({ closeDate }: { closeDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    function update() {
      const diff = closeDate.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft({ d, h, m, s })
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [closeDate])

  return (
    <div className="flex gap-3 justify-center mt-3">
      {[{ v: timeLeft.d, l: 'días' }, { v: timeLeft.h, l: 'hs' }, { v: timeLeft.m, l: 'min' }, { v: timeLeft.s, l: 'seg' }].map(({ v, l }) => (
        <div key={l} className="text-center bg-black/30 rounded-lg px-3 py-2 min-w-[52px]">
          <p className="text-2xl font-black text-white">{String(v).padStart(2, '0')}</p>
          <p className="text-xs text-gray-400">{l}</p>
        </div>
      ))}
    </div>
  )
}

export function VentanaStatus({ ventana }: VentanaStatusProps) {
  if (ventana.isOpen) {
    return (
      <div className="bg-black/40 border border-green-500/30 rounded-xl p-6 text-center max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 font-bold uppercase text-sm tracking-wide">ENCARGOS ABIERTOS</span>
        </div>
        <p className="text-gray-300 text-sm mb-1">{ventana.mensajeEstado}</p>
        <p className="text-gray-400 text-xs">Quedan {ventana.diasRestantes} día{ventana.diasRestantes !== 1 ? 's' : ''} para encargar</p>
        {ventana.closeDate && <CountdownTimer closeDate={new Date(ventana.closeDate)} />}
      </div>
    )
  }

  return (
    <div className="bg-black/40 border border-red-500/20 rounded-xl p-6 text-center max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
        <span className="text-red-400 font-bold uppercase text-sm tracking-wide">ENCARGOS CERRADOS</span>
      </div>
      <p className="text-gray-300 text-sm mb-4">Próxima apertura: {ventana.proximaApertura}</p>
      <p className="text-gray-400 text-xs">Igual podés explorar el catálogo y anotarte en la lista de espera.</p>
    </div>
  )
}
