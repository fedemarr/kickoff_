'use client'
import { useEffect, useState } from 'react'

export default function AdminConfigPage() {
  const [config, setConfig] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/config').then((r) => r.json()).then(setConfig)
  }, [])

  function set(key: string, val: any) {
    setConfig((prev) => ({ ...prev, [key]: val }))
  }

  async function save() {
    setSaving(true)
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const field = (key: string, label: string, type: 'text' | 'number' | 'textarea' = 'text') => (
    <div key={key}>
      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={config[key] || ''}
          onChange={(e) => set(key, e.target.value)}
          rows={3}
          className="input-field resize-none"
        />
      ) : (
        <input
          type={type}
          value={config[key] || ''}
          onChange={(e) => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
          className="input-field"
        />
      )}
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">Configuración de tienda</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Guardado</span>}
          <button onClick={save} disabled={saving} className="btn-primary text-sm py-2">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Banner */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Banner superior</h2>
          {field('bannerText', 'Texto del banner')}
        </section>

        {/* Hero */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Hero banner</h2>
          {field('heroTitle', 'Título')}
          {field('heroSubtitle', 'Subtítulo')}
          {field('heroCtaText', 'Texto del botón')}
        </section>

        {/* Beneficios */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Beneficios</h2>
          {field('freeShippingFrom', 'Monto mínimo envío gratis ($)', 'number')}
          {field('transferDiscount', '% descuento transferencia', 'number')}
          {field('installments', 'N° cuotas sin interés', 'number')}
          {field('shippingDeadlineText', 'Texto despacho rápido')}
        </section>

        {/* Estadísticas */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            {field('statClients', 'Clientes')}
            {field('statModels', 'Modelos')}
            {field('statSelecciones', 'Selecciones')}
            {field('statYears', 'Años')}
          </div>
        </section>

        {/* Redes */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Redes sociales y contacto</h2>
          {field('instagram', 'Instagram')}
          {field('tiktok', 'TikTok')}
          {field('email', 'Email')}
          {field('whatsapp', 'WhatsApp (con código de país)')}
        </section>

        {/* Transferencia */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Datos bancarios (transferencia)</h2>
          {field('cbu', 'CBU')}
          {field('alias', 'Alias')}
          {field('bankHolder', 'Titular de la cuenta')}
        </section>

        {/* Encargos */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Encargos</h2>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.encargoWindowOpen ?? true}
                onChange={(e) => set('encargoWindowOpen', e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Override: encargos abiertos manualmente</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('encargoWindow1Start', 'Ventana 1: día inicio', 'number')}
            {field('encargoWindow1End', 'Ventana 1: día fin', 'number')}
            {field('encargoWindow2Start', 'Ventana 2: día inicio', 'number')}
            {field('encargoWindow2End', 'Ventana 2: día fin', 'number')}
          </div>
          {field('encargoWhatsapp', 'WhatsApp para recibir encargos (con código de país, ej: 5491112345678)')}
          {field('encargoDeliveryTime', 'Tiempo estimado de entrega')}
          {field('encargoLegalText', 'Texto legal', 'textarea')}
        </section>
      </div>
    </div>
  )
}
