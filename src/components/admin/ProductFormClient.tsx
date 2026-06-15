'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

const CATEGORIES = [
  { value: 'SELECCIONES', label: 'Selecciones' },
  { value: 'CLUBES', label: 'Clubes' },
  { value: 'EQUIPAMIENTO', label: 'Equipamiento' },
]
const TAGS = [
  { value: 'NONE', label: 'Ninguna' },
  { value: 'NEW', label: 'Nuevo' },
  { value: 'SALE', label: 'Sale' },
  { value: 'FEATURED', label: 'Destacado' },
]

interface Variant {
  size: string
  price: number
  oldPrice?: number
  stock: number
  sku?: string
}

interface ProductFormClientProps {
  initialData?: any
  productId?: string
}

export function ProductFormClient({ initialData, productId }: ProductFormClientProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    brand: initialData?.brand || '',
    category: initialData?.category || 'SELECCIONES',
    tag: initialData?.tag || 'NONE',
    description: initialData?.description || '',
    details: initialData?.details || '',
    returns: initialData?.returns || '',
    active: initialData?.active ?? true,
    featured: initialData?.featured ?? false,
    images: (initialData?.images || []) as string[],
  })
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants || [{ size: 'S', price: 0, stock: 0 }]
  )
  const [imageUrl, setImageUrl] = useState('')

  function set(key: string, val: any) {
    setForm((prev) => ({
      ...prev,
      [key]: val,
      ...(key === 'name' && !productId ? { slug: slugify(val) } : {}),
    }))
  }

  function addVariant() {
    setVariants((prev) => [...prev, { size: '', price: 0, stock: 0 }])
  }

  function updateVariant(i: number, key: keyof Variant, val: any) {
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v))
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addImage() {
    if (!imageUrl.trim()) return
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }))
    setImageUrl('')
  }

  async function save() {
    setSaving(true)
    const url = productId ? `/api/productos/${productId}` : '/api/productos'
    const method = productId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, variants }),
    })

    router.push('/admin/productos')
  }

  const field = (key: string, label: string, type: 'text' | 'textarea' = 'text') => (
    <div key={key}>
      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} rows={4} className="input-field resize-none" />
      ) : (
        <input type="text" value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} className="input-field" />
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Información básica</h2>
        {field('name', 'Nombre *')}
        {field('slug', 'Slug (URL)')}
        {field('brand', 'Marca')}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Categoría</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-field">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Etiqueta</label>
            <select value={form.tag} onChange={(e) => set('tag', e.target.value)} className="input-field">
              {TAGS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm font-medium">Activo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-sm font-medium">Destacado en home</span>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
        <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Imágenes</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL de imagen (Cloudinary, etc.)"
            className="input-field flex-1"
          />
          <button onClick={addImage} className="btn-primary text-sm py-2 px-4 shrink-0">
            Agregar
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-16 h-16 object-cover rounded border" />
                <button
                  onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
                {i === 0 && <span className="text-xs text-primary font-bold">Principal</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Description */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Descripción y detalles</h2>
        {field('description', 'Descripción corta', 'textarea')}
        {field('details', 'Detalles (acordeón)', 'textarea')}
        {field('returns', 'Política de cambios (acordeón)', 'textarea')}
      </section>

      {/* Variants */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400">Variantes / Stock</h2>
          <button onClick={addVariant} className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            <Plus size={14} /> Agregar talle
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b">
                <th className="text-left py-2 pr-3">Talle</th>
                <th className="text-left py-2 pr-3">Precio ($)</th>
                <th className="text-left py-2 pr-3">Precio tachado ($)</th>
                <th className="text-left py-2 pr-3">Stock</th>
                <th className="text-left py-2 pr-3">SKU</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    <input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="M" className="input-field w-20" />
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" value={v.price} onChange={(e) => updateVariant(i, 'price', Number(e.target.value))} className="input-field w-28" />
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" value={v.oldPrice || ''} onChange={(e) => updateVariant(i, 'oldPrice', e.target.value ? Number(e.target.value) : undefined)} className="input-field w-28" />
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} className="input-field w-20" />
                  </td>
                  <td className="py-2 pr-3">
                    <input value={v.sku || ''} onChange={(e) => updateVariant(i, 'sku', e.target.value)} className="input-field w-28" placeholder="Opcional" />
                  </td>
                  <td className="py-2">
                    <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="btn-primary py-2.5 px-8">
          {saving ? 'Guardando...' : (productId ? 'Actualizar producto' : 'Crear producto')}
        </button>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 font-medium">
          Cancelar
        </button>
      </div>
    </div>
  )
}
