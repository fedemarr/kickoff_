import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProductFormClient } from '@/components/admin/ProductFormClient'

interface PageProps { params: { id: string } }

export default async function EditProductPage({ params }: PageProps) {
  let product: any = null
  try {
    product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: true },
    })
  } catch {}

  if (!product) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black mb-6">Editar producto</h1>
      <ProductFormClient initialData={product} productId={params.id} />
    </div>
  )
}
