const steps = [
  { num: '1', icon: '👀', title: 'Elegís tu camiseta', desc: 'Explorá el catálogo y encontrá la que querés.' },
  { num: '2', icon: '📋', title: 'Llenás el formulario', desc: 'Nos dejás tus datos y el producto que querés.' },
  { num: '3', icon: '✅', title: 'Te contactamos', desc: 'Coordinamos el pago y la entrega juntos.' },
]

export function HowItWorks() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-black uppercase text-center mb-10">¿CÓMO FUNCIONA?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4">
                {step.icon}
              </div>
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm mb-3">
                {step.num}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
