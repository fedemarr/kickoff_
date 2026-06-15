const defaultStats = [
  { value: '+500', label: 'Modelos' },
  { value: '+2K', label: 'Clientes' },
  { value: '20+', label: 'Selecciones' },
  { value: '3', label: 'Años' },
]

interface StatsBarProps {
  stats?: typeof defaultStats
}

export function StatsBar({ stats = defaultStats }: StatsBarProps) {
  return (
    <section className="bg-[#111] text-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Sobre nosotros</p>
            <h2 className="text-3xl font-black italic uppercase">
              LA TIENDA<br />
              <span className="text-primary">DE RUGBY</span><br />
              MÁS COMPLETA
            </h2>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-black text-primary">{value}</p>
                <p className="text-sm text-gray-400 mt-1 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
