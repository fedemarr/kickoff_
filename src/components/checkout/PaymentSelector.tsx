'use client'
import type { UseFormRegister } from 'react-hook-form'
import { formatPrice } from '@/lib/utils'

interface PaymentSelectorProps {
  register: UseFormRegister<any>
  selected: string
  bankDetails: { cbu: string; alias: string; bankHolder: string }
  transferDiscount: number
  installments: number
}

export function PaymentSelector({ register, selected, bankDetails, transferDiscount, installments }: PaymentSelectorProps) {
  return (
    <div>
      <h3 className="font-black uppercase text-sm tracking-wide mb-4">MÉTODO DE PAGO</h3>

      <div className="space-y-3">
        {/* MercadoPago */}
        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selected === 'MERCADOPAGO' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <input {...register('paymentMethod')} type="radio" value="MERCADOPAGO" className="mt-1 accent-primary" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Tarjetas ({installments} cuotas sin interés sin mínimo)</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">MercadoPago</span>
            </div>
            {selected === 'MERCADOPAGO' && (
              <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Descubrí la practicidad de Mercado Pago</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['VISA', 'MC', 'AMEX', 'NARANJA', 'CABAL'].map((card) => (
                    <span key={card} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">{card}</span>
                  ))}
                </div>
                <p className="text-xs text-green-600 font-medium">✓ Compra segura con el medio de pago que prefieras</p>
                <p className="text-xs text-gray-400 mt-1">Te llevaremos a Mercado Pago para completar el pago</p>
              </div>
            )}
          </div>
        </label>

        {/* Transferencia */}
        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selected === 'TRANSFER' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <input {...register('paymentMethod')} type="radio" value="TRANSFER" className="mt-1 accent-primary" />
          <div className="flex-1">
            <span className="font-semibold text-sm">Transferencia bancaria directa ({transferDiscount}% off)</span>
            {selected === 'TRANSFER' && bankDetails.cbu && (
              <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200 space-y-1.5 text-sm">
                {bankDetails.cbu && <div><span className="font-medium text-gray-600">CBU:</span> {bankDetails.cbu}</div>}
                {bankDetails.alias && <div><span className="font-medium text-gray-600">Alias:</span> {bankDetails.alias}</div>}
                {bankDetails.bankHolder && <div><span className="font-medium text-gray-600">Titular:</span> {bankDetails.bankHolder}</div>}
              </div>
            )}
          </div>
        </label>

        {/* Efectivo */}
        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${selected === 'CASH' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
          <input {...register('paymentMethod')} type="radio" value="CASH" className="mt-1 accent-primary" />
          <div className="flex-1">
            <span className="font-semibold text-sm">Efectivo en local (15% off)</span>
          </div>
        </label>
      </div>
    </div>
  )
}
