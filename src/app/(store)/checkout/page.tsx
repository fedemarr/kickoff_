import { prisma } from '@/lib/db'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  let config: any = null
  try {
    config = await prisma.siteConfig.findUnique({ where: { id: 'main' } })
  } catch {}

  const bankDetails = {
    cbu: config?.cbu || '',
    alias: config?.alias || '',
    bankHolder: config?.bankHolder || '',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black uppercase text-primary mb-8">CHECKOUT</h1>
      <CheckoutForm
        bankDetails={bankDetails}
        transferDiscount={config?.transferDiscount ?? 10}
        installments={config?.installments ?? 3}
      />
    </div>
  )
}
