'use client'
import { useState } from 'react'

export function WaitlistForm({ proximaApertura }: { proximaApertura: string }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-black/40 border border-gray-700 rounded-xl p-6 text-center max-w-md mx-auto">
        <p className="text-green-400 font-bold text-lg mb-1">¡Te anotamos! ✓</p>
        <p className="text-gray-400 text-sm">Te avisamos cuando los encargos abran {proximaApertura}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-black/40 border border-gray-700 rounded-xl p-6 max-w-md mx-auto text-center">
      <p className="text-white font-bold mb-1">¿Querés que te avisemos cuando abra?</p>
      <p className="text-gray-400 text-sm mb-4">Próxima apertura {proximaApertura}</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <button type="submit" disabled={loading} className="btn-primary text-sm px-4 py-2 shrink-0">
          {loading ? '...' : 'AVISAME'}
        </button>
      </div>
    </form>
  )
}
