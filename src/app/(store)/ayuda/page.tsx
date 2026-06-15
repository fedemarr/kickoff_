import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ayuda — Preguntas frecuentes' }

const faqs = [
  { q: '¿Cuánto tarda el envío?', a: 'Los pedidos se despachan dentro de las 24-48hs hábiles. El tiempo de entrega depende de tu provincia (3-7 días hábiles aproximadamente).' },
  { q: '¿Tienen envío gratis?', a: 'Sí, en compras superiores a $150.000 el envío es gratis a todo el país.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Aceptamos cambios y devoluciones dentro de los 30 días corridos. El producto debe estar sin uso, con etiquetas y en su embalaje original.' },
  { q: '¿Cómo pago con transferencia?', a: 'Al finalizar la compra, seleccioná "Transferencia bancaria" y recibirás los datos de nuestra cuenta. Recordá enviar el comprobante para confirmar tu pedido. Obtenés un 10% de descuento.' },
  { q: '¿Las camisetas son originales?', a: 'Sí, 100%. Trabajamos únicamente con productos oficiales y licenciados. Cada camiseta viene con sus etiquetas originales y garantía de autenticidad.' },
  { q: '¿Qué talle debo elegir?', a: 'Las camisetas de rugby suelen tener un talle más amplio en hombros. Recomendamos consultar la tabla de talles de cada producto o contactarnos por WhatsApp antes de comprar.' },
  { q: '¿Qué son los encargos?', a: 'Los encargos son pedidos especiales de camisetas que no tenemos en stock permanente. Los abrimos dos veces por mes (del 1 al 15 y del 16 al 30). Consultá el estado actual en la sección Encargos.' },
]

export default function AyudaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black uppercase mb-8">PREGUNTAS FRECUENTES</h1>
      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-2">{q}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
