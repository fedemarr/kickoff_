'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  { name: 'Matías G.', text: 'La camiseta llegó perfecta y en tiempo récord. La calidad es exactamente la de la web. Muy recomendable.', stars: 5 },
  { name: 'Lucía P.', text: 'Excelente atención. Me asesoraron con el talle y llegó justo a tiempo para el cumpleaños de mi hijo.', stars: 5 },
  { name: 'Rodrigo M.', text: 'Los precios son muy buenos y la calidad de la camiseta All Blacks es increíble. La usé en el partido y todos me preguntaron dónde la compré.', stars: 5 },
  { name: 'Ana S.', text: 'El proceso de compra fue súper fácil. Pagué por transferencia y me dieron el 10% de descuento. Volveré a comprar.', stars: 5 },
]

export function TestimonialsSlider() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Testimonials */}
          <div>
            <h2 className="section-title mb-8">LO QUE DICEN<br />NUESTROS CLIENTES</h2>

            <div className="relative">
              <div className="bg-gray-50 rounded-xl p-6 min-h-[160px]">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonials[current].stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">&ldquo;{testimonials[current].text}&rdquo;</p>
                <p className="font-bold text-gray-900 mt-4">— {testimonials[current].name}</p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={prev} className="p-2 border rounded hover:border-primary hover:text-primary transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary scale-125' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button onClick={next} className="p-2 border rounded hover:border-primary hover:text-primary transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Block */}
          <div className="bg-[#111] rounded-xl p-8 text-white">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">KickOff Store</p>
            <h3 className="text-2xl font-black uppercase italic mb-4">
              REMERAS<br />
              <span className="text-primary">IMPORTADAS</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trabajamos con remeras importadas de las mejores marcas del mundo, aptas para todo tipo de entrenamiento y uso diario. Cada prenda está seleccionada por su calidad de tela, durabilidad y diseño — para que te veas y te sientas como un jugador de élite dentro y fuera de la cancha.
            </p>
            <Link href="/selecciones" className="btn-primary inline-block text-sm">
              VER CATÁLOGO →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
