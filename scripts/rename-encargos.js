/**
 * Renombra los 42 EncargoProducts con sus nombres, marcas y datos reales.
 * Uso: node scripts/rename-encargos.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const MAPPING = [
  { code: 'A',  name: 'Irlanda Local 2025',                     brand: 'Canterbury',  newSlug: 'irlanda-local-2025',                    nation: 'Irlanda',       season: '2025', description: 'Verde oscuro con efecto humo. Sponsors IRFU / Vodafone.' },
  { code: 'B',  name: 'Springboks Local 2025 — Kaleidoscopio',  brand: 'Nike',        newSlug: 'springboks-local-2025-kaleidoscopio',   nation: 'Sudáfrica',     season: '2025', description: 'Verde kaleidoscopio. Sponsor FNB.' },
  { code: 'C',  name: 'Crusaders Local 2026 — 30 Años',         brand: 'Classic',     newSlug: 'crusaders-local-2026-30-anos',           league: 'Super Rugby',   season: '2026', description: 'Rojo/negro/blanco. Edición 30° aniversario. Sponsor Coolabah.' },
  { code: 'D',  name: 'Escocia Local 2025',                     brand: 'Macron',      newSlug: 'escocia-local-2025',                    nation: 'Escocia',       season: '2025', description: 'Azul marino con cuello blanco. Sponsor Arnold Clark.' },
  { code: 'E',  name: 'Hurricanes Local 2026',                  brand: 'Classic',     newSlug: 'hurricanes-local-2026',                 league: 'Super Rugby',   season: '2026', description: 'Amarillo/negro. Sponsor Kubota.' },
  { code: 'F',  name: 'Kenya Local',                            brand: 'Umbro',       newSlug: 'kenya-local',                           nation: 'Kenya',         season: '2025', description: 'Coral/roja tribal. Sponsors SportPesa / M-Pesa.' },
  { code: 'G',  name: 'Springboks Promo Multicolor',            brand: 'Nike',        newSlug: 'springboks-promo-multicolor',           nation: 'Sudáfrica',     season: '2025', description: 'Diseño multicolor kaleidoscopio de entrenamiento/promo.' },
  { code: 'H',  name: 'Australia Wallabies Indigenous',         brand: 'Castore',     newSlug: 'wallabies-indigenous',                  nation: 'Australia',     season: '2025', description: 'Naranja con arte aborigen. Sponsors Cadbury / Santos.' },
  { code: 'I',  name: 'Irlanda Clásica Local',                  brand: 'Canterbury',  newSlug: 'irlanda-clasica-local',                 nation: 'Irlanda',       season: '2025', description: 'Verde sólido clásico. Sponsor Vodafone.' },
  { code: 'J',  name: 'Escocia Third 2025 — Rosa',              brand: 'Macron',      newSlug: 'escocia-third-2025-rosa',               nation: 'Escocia',       season: '2025', description: 'Rosa/lavanda. Sponsor Arnold Clark.' },
  { code: 'K',  name: 'Stade Toulousain Third — Olas',          brand: 'Nike',        newSlug: 'toulouse-third-olas',                   league: 'Top 14',        season: '2025', description: 'Negra con olas rojas metalizadas. Sponsor Peugeot.' },
  { code: 'L',  name: 'Harlequins Cup — Fuegos Artificiales',   brand: 'Castore',     newSlug: 'harlequins-cup-fireworks',              league: 'Premiership',   season: '2025', description: 'Negra con fuegos artificiales. Sponsor DHL.' },
  { code: 'M',  name: 'Springboks Away 2025',                   brand: 'Nike',        newSlug: 'springboks-away-2025',                  nation: 'Sudáfrica',     season: '2025', description: 'Blanca "Forever Green Forever Gold". Sponsor FNB.' },
  { code: 'N',  name: 'Māori All Blacks',                       brand: 'Adidas',      newSlug: 'maori-all-blacks',                      nation: 'Nueva Zelanda', season: '2025', description: 'Negra con tā moko rojo. Sponsor Altrad.' },
  { code: 'Ñ',  name: 'Cardiff Rugby Local',                    brand: 'Macron',      newSlug: 'cardiff-local',                         league: 'URC',           season: '2025', description: 'Azul/negro con iconos de la ciudad. Sponsor RSK.' },
  { code: 'O',  name: 'Northampton Saints Local',               brand: 'Macron',      newSlug: 'northampton-saints-local',              league: 'Premiership',   season: '2025', description: 'Verde/negro/dorado. Sponsor cinch.' },
  { code: 'P',  name: 'Gallagher Chiefs Away — 30 Años',        brand: 'Classic',     newSlug: 'chiefs-away-30-anos',                   league: 'Super Rugby',   season: '2026', description: 'Blanca con diseño Māori. Edición 30° aniversario. Sponsor Gallagher.' },
  { code: 'Q',  name: 'Harlequins Local',                       brand: 'Castore',     newSlug: 'harlequins-local',                      league: 'Premiership',   season: '2025', description: 'Cuartos clásicos. Sponsor DHL.' },
  { code: 'R',  name: 'Irlanda Alternativa — Psicodélica',      brand: 'Canterbury',  newSlug: 'irlanda-alternativa-psicodemica',       nation: 'Irlanda',       season: '2025', description: 'Negra con estampado psicodélico verde/azul. Sponsor Vodafone.' },
  { code: 'S',  name: 'Irlanda Away 2025',                      brand: 'Canterbury',  newSlug: 'irlanda-away-2025',                     nation: 'Irlanda',       season: '2025', description: 'Blanca con cuello verde. Sponsor Vodafone.' },
  { code: 'T',  name: 'Ulster Away — European',                 brand: 'Castore',     newSlug: 'ulster-away-european',                  league: 'URC',           season: '2025', description: 'Negra con diseño geométrico. Sponsors SAM / Bank of Ireland.' },
  { code: 'U',  name: 'Crusaders Away 2026 — 30 Años',          brand: 'Classic',     newSlug: 'crusaders-away-2026-30-anos',           league: 'Super Rugby',   season: '2026', description: 'Negra con rayos rojos. Edición 30° aniversario. Sponsor CAT.' },
  { code: 'V',  name: 'Connacht Rugby — 140° Aniversario',      brand: 'Macron',      newSlug: 'connacht-140-aniversario',              league: 'URC',           season: '2025', description: 'Verde oscuro/dorado. Edición 140° aniversario. Sponsor Genesys.' },
  { code: 'W',  name: 'Ulster Local',                           brand: 'Castore',     newSlug: 'ulster-local',                          league: 'URC',           season: '2025', description: 'Blanca/roja. Sponsors SAM / Bank of Ireland.' },
  { code: 'X',  name: 'Stade Toulousain Local',                 brand: 'Nike',        newSlug: 'toulouse-local',                        league: 'Top 14',        season: '2025', description: 'Roja. Sponsors Peugeot / Airbus.' },
  { code: 'Y',  name: 'Gallagher Chiefs Local — 30 Años',       brand: 'Classic',     newSlug: 'chiefs-local-30-anos',                  league: 'Super Rugby',   season: '2026', description: 'Negra Māori con llamas. Edición 30° aniversario. Sponsor Gallagher.' },
  { code: 'Z',  name: 'Gales Away 2025',                        brand: 'Macron',      newSlug: 'gales-away-2025',                       nation: 'Gales',         season: '2025', description: 'Blanca con diseño topográfico. Sponsor Vodafone.' },
  { code: 'AA', name: 'Springboks Local 2025 — Forever Green',  brand: 'Nike',        newSlug: 'springboks-local-2025-forever-green',   nation: 'Sudáfrica',     season: '2025', description: 'Verde "Forever Green". Sponsor FNB.' },
  { code: 'BB', name: 'Springbok Sevens',                       brand: 'Nike',        newSlug: 'springbok-sevens',                      nation: 'Sudáfrica',     season: '2025', description: 'Blanca con estrella verde. Versión Sevens.' },
  { code: 'CC', name: 'Stade Toulousain Away — Capitolium',     brand: 'Nike',        newSlug: 'toulouse-away-capitolium',              league: 'Top 14',        season: '2025', description: 'Crema/rosa. Diseño "Capitolium". Sponsor Peugeot.' },
  { code: 'DD', name: 'Leinster Away',                          brand: 'Castore',     newSlug: 'leinster-away',                         league: 'URC',           season: '2025', description: 'Blanca/dorada degradé. Sponsor Bank of Ireland.' },
  { code: 'EE', name: 'Fiji Drua Local',                        brand: 'New Balance', newSlug: 'fiji-drua-local',                       league: 'Super Rugby',   season: '2025', description: 'Azul con patrones fiyianos. Sponsor Swire Shipping.' },
  { code: 'FF', name: 'Inglaterra Training',                    brand: 'Castore',     newSlug: 'inglaterra-training',                   nation: 'Inglaterra',    season: '2025', description: 'Azul oscuro/morado. Sponsor O2.' },
  { code: 'GG', name: 'Australia Wallaroos Indigenous',         brand: 'Castore',     newSlug: 'wallaroos-indigenous',                  nation: 'Australia',     season: '2025', description: 'Blanca con arte aborigen. Selección femenina. Sponsor Cadbury.' },
  { code: 'HH', name: 'Gales Local 2025',                       brand: 'Macron',      newSlug: 'gales-local-2025',                      nation: 'Gales',         season: '2025', description: 'Roja con diseño geométrico. Sponsor Vodafone.' },
  { code: 'II', name: 'Stade Toulousain Third "Tolosa"',        brand: 'Nike',        newSlug: 'toulouse-third-tolosa',                 league: 'Top 14',        season: '2025', description: 'Negra full text "Tolosa". Sponsor Peugeot.' },
  { code: 'JJ', name: 'Harlequins Third — Rosa',                brand: 'Castore',     newSlug: 'harlequins-third-rosa',                 league: 'Premiership',   season: '2025', description: 'Rosa con salpicaduras. Sponsor DHL.' },
]

async function main() {
  console.log(`\n✏️  Renombrando ${MAPPING.length} EncargoProducts...\n`)

  let updated = 0
  let notFound = 0

  for (const item of MAPPING) {
    const oldSlug = `encargo-${item.code.toLowerCase()}`

    const existing = await prisma.encargoProduct.findUnique({ where: { slug: oldSlug } })
    if (!existing) {
      console.log(`  ⚠️  No encontrado: ${oldSlug}`)
      notFound++
      continue
    }

    await prisma.encargoProduct.update({
      where: { slug: oldSlug },
      data: {
        name: item.name,
        slug: item.newSlug,
        brand: item.brand,
        description: item.description ?? null,
        season: item.season ?? null,
        nation: item.nation ?? null,
        league: item.league ?? null,
      },
    })

    console.log(`  ✅ [${item.code}] → ${item.name}`)
    updated++
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Actualizados: ${updated}`)
  if (notFound > 0) console.log(`⚠️  No encontrados: ${notFound}`)

  // Listar los que quedaron sin mapear (KK-OO)
  const remaining = await prisma.encargoProduct.findMany({
    where: { name: { startsWith: 'Camiseta [' } },
    select: { name: true, slug: true },
  })
  if (remaining.length > 0) {
    console.log(`\n📋 Sin identificar todavía (${remaining.length}):`)
    for (const r of remaining) console.log(`   ${r.name} — ${r.slug}`)
  }
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
