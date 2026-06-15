import { Truck, CreditCard, Percent } from 'lucide-react'

const benefits = [
  {
    Icon: Truck,
    title: 'Envío gratis',
    subtitle: 'En compras superiores a $150.000',
  },
  {
    Icon: CreditCard,
    title: 'Financiación',
    subtitle: '3 cuotas sin intereses en toda la tienda',
  },
  {
    Icon: Percent,
    title: '10% OFF',
    subtitle: 'Si pagás con transferencia bancaria',
  },
]

export function BenefitsBar() {
  return (
    <div className="border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {benefits.map(({ Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-4 px-6 py-5">
              <div className="bg-primary/10 p-3 rounded-full shrink-0">
                <Icon size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
