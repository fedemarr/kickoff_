import { CreditCard, RefreshCw, Clock } from 'lucide-react'
import { formatPrice, discountedPrice, installmentPrice } from '@/lib/utils'
import type { ProductVariant } from '@/types'

interface PriceBlockProps {
  variant: ProductVariant
  transferDiscount?: number
  installments?: number
  shippingText?: string
}

export function PriceBlock({ variant, transferDiscount = 10, installments = 3, shippingText }: PriceBlockProps) {
  const transferPrice = discountedPrice(variant.price, transferDiscount)
  const cuota = installmentPrice(variant.price, installments)

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-bold text-gray-900">{formatPrice(variant.price)}</span>
        {variant.oldPrice && (
          <span className="text-lg text-gray-400 line-through">{formatPrice(variant.oldPrice)}</span>
        )}
      </div>

      <p className="text-sm text-green-600 font-medium flex items-center gap-1.5 mb-4">
        <Clock size={14} />
        {shippingText || '¡Comprá hoy y despachamos mañana!'}
      </p>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard size={15} className="text-primary shrink-0" />
          <span>
            {transferDiscount}% off con transferencia:{' '}
            <span className="font-bold text-gray-800">{formatPrice(transferPrice)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CreditCard size={15} className="text-green-cuotas shrink-0" />
          <span className="text-green-cuotas font-medium">
            {installments} cuotas sin interés de {formatPrice(cuota)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw size={15} className="text-gray-400 shrink-0" />
          Devolución simple si no te queda
        </div>
      </div>
    </div>
  )
}
