import type { Metadata } from 'next'
import { MessageCircle, Mail, ChevronDown } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = { title: 'Contacto — KickOff Rugby' }
export const dynamic = 'force-dynamic'

const faqs = [
  { q: '¿Cuánto tarda el envío?', a: 'Los pedidos se despachan dentro de las 24-48hs hábiles. El tiempo de entrega depende de tu provincia (3-7 días hábiles aproximadamente).' },
  { q: '¿Tienen envío gratis?', a: 'Sí, en compras superiores a $150.000 el envío es gratis a todo el país.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Aceptamos cambios y devoluciones dentro de los 30 días corridos. El producto debe estar sin uso, con etiquetas y en su embalaje original.' },
  { q: '¿Cómo pago con transferencia?', a: 'Al finalizar la compra, seleccioná "Transferencia bancaria" y recibirás los datos de nuestra cuenta. Recordá enviar el comprobante para confirmar tu pedido. Obtenés un 10% de descuento.' },
  { q: '¿Las camisetas son originales?', a: 'Sí, 100%. Trabajamos únicamente con productos oficiales y licenciados. Cada camiseta viene con sus etiquetas originales y garantía de autenticidad.' },
  { q: '¿Qué talle debo elegir?', a: 'Las camisetas de rugby suelen tener un talle más amplio en hombros. Recomendamos consultar la tabla de talles de cada producto o contactarnos por WhatsApp antes de comprar.' },
  { q: '¿Qué son los encargos?', a: 'Los encargos son pedidos especiales de camisetas que no tenemos en stock permanente. Los abrimos dos veces por mes (del 1 al 15 y del 16 al 30). Consultá el estado actual en la sección Encargos.' },
  { q: '¿Qué es la pre venta?', a: 'La pre venta te permite reservar productos antes de que lleguen al stock general, con precio especial. El pago se hace al momento de confirmar y te avisamos cuando está listo para despachar.' },
]

async function getConfig() {
  try {
    return await prisma.siteConfig.findUnique({ where: { id: 'main' } })
  } catch {
    return null
  }
}

export default async function ContactoPage() {
  const config = await getConfig()

  const whatsapp = config?.whatsapp || ''
  const instagram = config?.instagram || '@kickoff.tienda'
  const email = config?.email || 'kickoff@tienda.com'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-4">
        <span>Inicio</span> / <span className="text-gray-700 font-medium">Contacto</span>
      </nav>

      <h1 className="text-3xl font-black uppercase mb-2">Contacto</h1>
      <p className="text-gray-500 mb-10 text-sm">Estamos para ayudarte. Escribinos por cualquiera de estos medios.</p>

      {/* Contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-green-400 hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <MessageCircle size={22} className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-sm">WhatsApp</p>
              <p className="text-xs text-gray-400 mt-0.5">Respuesta rápida</p>
            </div>
            <span className="text-xs text-green-600 font-medium">Escribinos →</span>
          </a>
        )}

        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
            <span className="text-xl">📸</span>
          </div>
          <div>
            <p className="font-bold text-sm">Instagram</p>
            <p className="text-xs text-gray-400 mt-0.5">{instagram}</p>
          </div>
          <span className="text-xs text-pink-500 font-medium">Seguinos →</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Mail size={22} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm">Email</p>
            <p className="text-xs text-gray-400 mt-0.5">{email}</p>
          </div>
          <span className="text-xs text-primary font-medium">Escribir →</span>
        </a>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-gray-100 rounded-xl shadow-sm">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-gray-800 list-none select-none">
                {q}
                <ChevronDown size={16} className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
