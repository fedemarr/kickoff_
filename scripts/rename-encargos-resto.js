require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const RESTO = [
  { oldSlug: 'encargo-ll', name: 'Stade Toulousain Training — Neón',  brand: 'Nike',      newSlug: 'toulouse-training-neon',  league: 'Top 14',  season: '2025', description: 'Camiseta de entrenamiento Stade Toulousain. Sponsor Peugeot.' },
  { oldSlug: 'encargo-mm', name: 'Irlanda Suplente',                  brand: 'Canterbury', newSlug: 'irlanda-suplente',        nation: 'Irlanda', season: '2025', description: 'Camiseta suplente de Irlanda. Sponsor Vodafone.' },
  { oldSlug: 'encargo-nn', name: 'Crusaders — Edición Especial',      brand: 'Classic',    newSlug: 'crusaders-edicion-especial', league: 'Super Rugby', season: '2026', description: 'Edición especial Crusaders. Sponsor Coolabah.' },
  { oldSlug: 'encargo-oo', name: 'Kenya Rugby Union',                 brand: 'Umbro',      newSlug: 'kenya-rugby-union',       nation: 'Kenya',   season: '2025', description: 'Camiseta Kenya Rugby Union. Sponsor SportPesa.' },
]

async function main() {
  for (const item of RESTO) {
    await prisma.encargoProduct.update({
      where: { slug: item.oldSlug },
      data: {
        name: item.name,
        slug: item.newSlug,
        brand: item.brand,
        description: item.description,
        season: item.season ?? null,
        nation: item.nation ?? null,
        league: item.league ?? null,
      },
    })
    console.log(`✅ ${item.oldSlug} → ${item.name}`)
  }

  const kk = await prisma.encargoProduct.findUnique({ where: { slug: 'encargo-kk' } })
  if (kk) console.log(`\n⚠️  KK (${kk.slug}) sigue sin identificar — avisame qué camiseta es.`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
