import { ProductFormClient } from '@/components/admin/ProductFormClient'

export default function NuevoProductoPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black mb-6">Nuevo producto</h1>
      <ProductFormClient />
    </div>
  )
}
