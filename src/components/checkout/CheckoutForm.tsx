'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { OrderSummary } from './OrderSummary'
import { PaymentSelector } from './PaymentSelector'
import { useCheckout, type CheckoutFormData } from '@/hooks/useCheckout'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'next/navigation'

const PROVINCES = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

const schema = z.object({
  dni: z.string().min(7).max(11).regex(/^\d+$/, 'Solo números'),
  firstName: z.string().min(2, 'Requerido'),
  lastName: z.string().min(2, 'Requerido'),
  street: z.string().min(5, 'Requerido'),
  city: z.string().min(2, 'Requerido'),
  province: z.string().min(2, 'Requerido'),
  zipCode: z.string().min(4).max(8).regex(/^\d+$/, 'Solo números'),
  phone: z.string().min(6, 'Requerido'),
  email: z.string().email('Email inválido'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['MERCADOPAGO', 'TRANSFER', 'CASH']),
  couponCode: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CheckoutFormProps {
  bankDetails: { cbu: string; alias: string; bankHolder: string }
  transferDiscount: number
  installments: number
}

export function CheckoutForm({ bankDetails, transferDiscount, installments }: CheckoutFormProps) {
  const router = useRouter()
  const { items, total } = useCartStore()
  const { submitCheckout, loading, error } = useCheckout()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'MERCADOPAGO' },
  })

  const paymentMethod = watch('paymentMethod')

  async function onSubmit(data: FormValues) {
    try {
      const result = await submitCheckout(data as CheckoutFormData)
      if (result) {
        router.push(`/checkout/success?order=${result.orderNumber}`)
      }
    } catch {}
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <a href="/selecciones" className="btn-primary inline-block">Ver productos</a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* Left: form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black uppercase mb-5">DETALLES DE FACTURACIÓN Y ENVÍO</h2>

            <div className="space-y-4">
              {/* DNI */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">DNI / CUIT / CUIL *</label>
                <input {...register('dni')} placeholder="DNI / CUIT / CUIL" className="input-field" />
                {errors.dni && <p className="text-xs text-primary mt-1">{errors.dni.message}</p>}
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">NOMBRE *</label>
                  <input {...register('firstName')} className="input-field" />
                  {errors.firstName && <p className="text-xs text-primary mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">APELLIDOS *</label>
                  <input {...register('lastName')} className="input-field" />
                  {errors.lastName && <p className="text-xs text-primary mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">PAÍS / REGIÓN *</label>
                <div className="input-field bg-gray-50 text-gray-500 cursor-not-allowed">Argentina</div>
              </div>

              {/* Street */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">DIRECCIÓN *</label>
                <input {...register('street')} placeholder="Nombre de la calle y número" className="input-field" />
                {errors.street && <p className="text-xs text-primary mt-1">{errors.street.message}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">CIUDAD *</label>
                <input {...register('city')} className="input-field" />
                {errors.city && <p className="text-xs text-primary mt-1">{errors.city.message}</p>}
              </div>

              {/* Province + ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">PROVINCIA *</label>
                  <select {...register('province')} className="input-field">
                    <option value="">Seleccioná...</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-xs text-primary mt-1">{errors.province.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">CÓDIGO POSTAL *</label>
                  <input {...register('zipCode')} className="input-field" />
                  {errors.zipCode && <p className="text-xs text-primary mt-1">{errors.zipCode.message}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">TELÉFONO *</label>
                <div className="flex gap-2">
                  <span className="input-field w-14 bg-gray-50 text-gray-500 text-center shrink-0">+54</span>
                  <input {...register('phone')} placeholder="Número sin el 54" className="input-field flex-1" />
                </div>
                {errors.phone && <p className="text-xs text-primary mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">CORREO ELECTRÓNICO *</label>
                <input {...register('email')} type="email" className="input-field" />
                {errors.email && <p className="text-xs text-primary mt-1">{errors.email.message}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">NOTAS DEL PEDIDO (OPCIONAL)</label>
                <textarea {...register('notes')} rows={3} placeholder="Notas sobre tu pedido..." className="input-field resize-none" />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <PaymentSelector
            register={register}
            selected={paymentMethod}
            bankDetails={bankDetails}
            transferDiscount={transferDiscount}
            installments={installments}
          />

          {error && <p className="text-sm text-primary bg-red-50 px-4 py-2 rounded">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
            {loading ? 'PROCESANDO...' : 'REALIZAR EL PEDIDO →'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Tus datos personales van a ser usados solamente para procesar tu compra.
          </p>
        </div>

        {/* Right: order summary */}
        <div className="lg:sticky lg:top-6">
          <OrderSummary />
        </div>
      </div>
    </form>
  )
}
