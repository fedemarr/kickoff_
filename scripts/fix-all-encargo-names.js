/**
 * Corrige los 42 EncargoProducts con los nombres/datos correctos basados en
 * identificación visual de cada foto.
 *
 * USA DOS PASADAS para evitar colisiones de slugs únicos:
 *   Pasada 1 → todos a slug temporal "tmp-[code]-fix"
 *   Pasada 2 → todos al slug correcto definitivo
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// currentSlug: valor actual en la DB (puesto por scripts anteriores, INCORRECTOS)
// slug: valor correcto definitivo
const FIXES = [
  // ── Letras simples A-Z ──────────────────────────────────────────────────────
  {
    code: 'A', currentSlug: 'irlanda-local-2025',
    name: 'Harlequins Local', slug: 'harlequins-local',
    brand: 'Castore', league: 'Premiership', nation: null, season: '2025',
    description: 'Cuartos clásicos con rayas. Sponsor DHL.',
  },
  {
    code: 'B', currentSlug: 'springboks-local-2025-kaleidoscopio',
    name: 'Irlanda Away 2025', slug: 'irlanda-away-2025',
    brand: 'Canterbury', league: null, nation: 'Irlanda', season: '2025',
    description: 'Blanca. Sponsors IRFU / Vodafone.',
  },
  {
    code: 'C', currentSlug: 'crusaders-local-2026-30-anos',
    name: 'Crusaders Away 2026 — 30 Años', slug: 'crusaders-away-2026-30-anos',
    brand: 'Classic', league: 'Super Rugby', nation: null, season: '2026',
    description: 'Negra con rayos rojos. Edición 30° aniversario. Sponsor CAT.',
  },
  {
    code: 'D', currentSlug: 'escocia-local-2025',
    name: 'Stade Toulousain Training — Neón', slug: 'toulouse-training-neon',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Amarillo neón de entrenamiento. Sponsors Peugeot / Airbus / Kumho.',
  },
  {
    code: 'E', currentSlug: 'hurricanes-local-2026',
    name: 'Leinster Local', slug: 'leinster-local',
    brand: 'Castore', league: 'URC', nation: null, season: '2025',
    description: 'Azul con diseño de mapa. Sponsor Bank of Ireland.',
  },
  {
    code: 'F', currentSlug: 'kenya-local',
    name: 'Stade Toulousain Local', slug: 'toulouse-local',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Roja. Sponsors Peugeot / Airbus / Rempart.',
  },
  {
    code: 'G', currentSlug: 'springboks-promo-multicolor',
    name: 'Gales Away 2025', slug: 'gales-away-2025',
    brand: 'Macron', league: null, nation: 'Gales', season: '2025',
    description: 'Blanca con diseño topográfico. Sponsors WRU / Vodafone.',
  },
  {
    code: 'H', currentSlug: 'wallabies-indigenous',
    name: 'Stade Toulousain Away — Capitolium', slug: 'toulouse-away-capitolium',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Crema/rosa. Diseño Capitolium. Sponsors Peugeot / Airbus / Rempart.',
  },
  {
    code: 'I', currentSlug: 'irlanda-clasica-local',
    name: 'Springboks Local 2025 — Forever Green', slug: 'springboks-local-2025',
    brand: 'Nike', league: null, nation: 'Sudáfrica', season: '2025',
    description: 'Verde "Forever Green". Sponsor FNB.',
  },
  {
    code: 'J', currentSlug: 'escocia-third-2025-rosa',
    name: 'Stade Toulousain Away', slug: 'toulouse-away-stripes',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Blanca con rayas negras/rojas horizontales. Sponsors Peugeot / Airbus / Rempart.',
  },
  {
    code: 'K', currentSlug: 'toulouse-third-olas',
    name: 'Inglaterra Training', slug: 'inglaterra-training',
    brand: 'Castore', league: null, nation: 'Inglaterra', season: '2025',
    description: 'Azul oscuro/morado. Sponsor O2.',
  },
  {
    code: 'L', currentSlug: 'harlequins-cup-fireworks',
    name: 'Gales Local 2025', slug: 'gales-local-2025',
    brand: 'Macron', league: null, nation: 'Gales', season: '2025',
    description: 'Roja con diseño geométrico. Sponsors WRU / Vodafone.',
  },
  {
    code: 'M', currentSlug: 'springboks-away-2025',
    name: 'Harlequins Third — Rosa', slug: 'harlequins-third-rosa',
    brand: 'Castore', league: 'Premiership', nation: null, season: '2025',
    description: 'Rosa con salpicaduras. Sponsor DHL.',
  },
  {
    code: 'N', currentSlug: 'maori-all-blacks',
    name: 'Springbok Sevens Local', slug: 'springbok-sevens-local',
    brand: 'Nike', league: null, nation: 'Sudáfrica', season: '2025',
    description: 'Verde kaleidoscopio. Versión Sevens.',
  },
  {
    code: 'Ñ', currentSlug: 'cardiff-local',
    name: 'Escocia Local — Heritage', slug: 'escocia-local-heritage',
    brand: 'Macron', league: null, nation: 'Escocia', season: '2025',
    description: 'Azul marino, cuello blanco. Murrayfield 1925. Sponsor Arnold Clark. ⚠️ Las fotos en Cloudinary son incorrectas (colisión de nombre de archivo con N).',
  },
  {
    code: 'O', currentSlug: 'northampton-saints-local',
    name: 'Hurricanes Local 2026', slug: 'hurricanes-local-2026',
    brand: 'Classic', league: 'Super Rugby', nation: null, season: '2026',
    description: 'Amarillo/negro. Sponsor Kubota.',
  },
  {
    code: 'P', currentSlug: 'chiefs-away-30-anos',
    name: 'Springboks Promo Multicolor', slug: 'springboks-promo-multicolor',
    brand: 'Nike', league: null, nation: 'Sudáfrica', season: '2025',
    description: 'Multicolor kaleidoscopio. Colección especial.',
  },
  {
    code: 'Q', currentSlug: 'harlequins-local',
    name: 'Australia Wallabies Indigenous', slug: 'wallabies-indigenous',
    brand: 'Castore', league: null, nation: 'Australia', season: '2025',
    description: 'Naranja con arte aborigen. Sponsors Cadbury / Santos.',
  },
  {
    code: 'R', currentSlug: 'irlanda-alternativa-psicodemica',
    name: 'Irlanda Clásica Local', slug: 'irlanda-clasica-local',
    brand: 'Canterbury', league: null, nation: 'Irlanda', season: '2025',
    description: 'Verde sólido clásico, cuello blanco. Sponsors IRFU / Vodafone.',
  },
  {
    code: 'S', currentSlug: 'irlanda-away-2025',
    name: 'Escocia Third 2025 — Rosa', slug: 'escocia-third-2025-rosa',
    brand: 'Macron', league: null, nation: 'Escocia', season: '2025',
    description: 'Rosa/lavanda. Sponsor Arnold Clark.',
  },
  {
    code: 'T', currentSlug: 'ulster-away-european',
    name: 'Stade Toulousain Third — Olas', slug: 'toulouse-third-olas',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Negra con olas rojas metalizadas. Sponsors Peugeot / Airbus / Kumho.',
  },
  {
    code: 'U', currentSlug: 'crusaders-away-2026-30-anos',
    name: 'Harlequins Cup — Fuegos Artificiales', slug: 'harlequins-cup-fireworks',
    brand: 'Castore', league: 'Premiership', nation: null, season: '2025',
    description: 'Negra con fuegos artificiales. Sponsor DHL.',
  },
  {
    code: 'V', currentSlug: 'connacht-140-aniversario',
    name: 'Springboks Away 2025', slug: 'springboks-away-2025',
    brand: 'Nike', league: null, nation: 'Sudáfrica', season: '2025',
    description: 'Blanca "Forever Green Forever Gold". Sponsor FNB.',
  },
  {
    code: 'W', currentSlug: 'ulster-local',
    name: 'Māori All Blacks', slug: 'maori-all-blacks',
    brand: 'Adidas', league: null, nation: 'Nueva Zelanda', season: '2025',
    description: 'Negra con tā moko rojo. Sponsor Altrad.',
  },
  {
    code: 'X', currentSlug: 'toulouse-local',
    name: 'Cardiff Rugby Local', slug: 'cardiff-local',
    brand: 'Macron', league: 'URC', nation: null, season: '2025',
    description: 'Azul/negro con iconos de la ciudad. Sponsor RSK.',
  },
  {
    code: 'Y', currentSlug: 'chiefs-local-30-anos',
    name: 'Northampton Saints Local', slug: 'northampton-saints-local',
    brand: 'Macron', league: 'Premiership', nation: null, season: '2025',
    description: 'Verde/negro/dorado. Sponsor cinch.',
  },
  {
    code: 'Z', currentSlug: 'gales-away-2025',
    name: 'Gallagher Chiefs Away — 30 Años', slug: 'chiefs-away-30-anos',
    brand: 'Classic', league: 'Super Rugby', nation: null, season: '2026',
    description: 'Blanca con diseño Māori. Edición 30° aniversario. Sponsor Gallagher.',
  },
  // ── Dobles AA-JJ ────────────────────────────────────────────────────────────
  {
    code: 'AA', currentSlug: 'springboks-local-2025-forever-green',
    name: 'Irlanda Alternativa — Psicodélica', slug: 'irlanda-alternativa-psicodemica',
    brand: 'Canterbury', league: null, nation: 'Irlanda', season: '2025',
    description: 'Negra con estampado psicodélico verde/azul. Sponsors IRFU / Vodafone.',
  },
  {
    code: 'BB', currentSlug: 'springbok-sevens',
    name: 'Ulster Away — European', slug: 'ulster-away-european',
    brand: 'Castore', league: 'URC', nation: null, season: '2025',
    description: 'Negra con diseño geométrico. Sponsors SAM / Bank of Ireland.',
  },
  {
    code: 'CC', currentSlug: 'toulouse-away-capitolium',
    name: 'Connacht Rugby — 140° Aniversario', slug: 'connacht-140-aniversario',
    brand: 'Macron', league: 'URC', nation: null, season: '2025',
    description: 'Verde oscuro/dorado. Edición 140° aniversario. Sponsor Genesys.',
  },
  {
    code: 'DD', currentSlug: 'leinster-away',
    name: 'Escocia Local 2025', slug: 'escocia-local-2025',
    brand: 'Macron', league: null, nation: 'Escocia', season: '2025',
    description: 'Azul marino. Sponsor Arnold Clark.',
  },
  {
    code: 'EE', currentSlug: 'fiji-drua-local',
    name: 'Kenya Away', slug: 'kenya-away',
    brand: 'Umbro', league: null, nation: 'Kenya', season: '2025',
    description: 'Blanca. Sponsors Kenya Rugby Union / SportPesa.',
  },
  {
    code: 'FF', currentSlug: 'inglaterra-training',
    name: 'Gallagher Chiefs Local — 30 Años', slug: 'chiefs-local-30-anos',
    brand: 'Classic', league: 'Super Rugby', nation: null, season: '2026',
    description: 'Negra Māori con llamas doradas. Edición 30° aniversario. Sponsor Gallagher.',
  },
  {
    code: 'GG', currentSlug: 'wallaroos-indigenous',
    name: 'Springbok Sevens Away', slug: 'springbok-sevens-away',
    brand: 'Nike', league: null, nation: 'Sudáfrica', season: '2025',
    description: 'Blanca kaleidoscopio. Versión Sevens.',
  },
  {
    code: 'HH', currentSlug: 'gales-local-2025',
    name: 'Leinster Away', slug: 'leinster-away',
    brand: 'Castore', league: 'URC', nation: null, season: '2025',
    description: 'Blanca/dorada degradé. Sponsor Bank of Ireland.',
  },
  {
    code: 'II', currentSlug: 'toulouse-third-tolosa',
    name: 'Ulster Local', slug: 'ulster-local',
    brand: 'Castore', league: 'URC', nation: null, season: '2025',
    description: 'Blanca/roja. Sponsors SAM / Bank of Ireland.',
  },
  {
    code: 'JJ', currentSlug: 'harlequins-third-rosa',
    name: 'Fiji Drua Local', slug: 'fiji-drua-local',
    brand: 'New Balance', league: 'Super Rugby', nation: null, season: '2025',
    description: 'Azul con patrones fiyianos. Sponsor Swire Shipping.',
  },
  // ── Extras KK-OO ────────────────────────────────────────────────────────────
  {
    code: 'KK', currentSlug: 'wallabies-away',
    name: 'Australia Wallaroos Indigenous', slug: 'wallaroos-indigenous',
    brand: 'Castore', league: null, nation: 'Australia', season: '2025',
    description: 'Blanca con arte aborigen. Selección femenina. Sponsor Cadbury.',
  },
  {
    code: 'LL', currentSlug: 'toulouse-training-neon',
    name: 'Stade Toulousain Third "Tolosa"', slug: 'toulouse-third-tolosa',
    brand: 'Nike', league: 'Top 14', nation: null, season: '2025',
    description: 'Negra con texto "Tolosa". Sponsors Peugeot / Airbus / Kumho.',
  },
  {
    code: 'MM', currentSlug: 'irlanda-suplente',
    name: 'Irlanda Local 2025', slug: 'irlanda-local-2025',
    brand: 'Canterbury', league: null, nation: 'Irlanda', season: '2025',
    description: 'Verde oscuro con efecto humo. Sponsors IRFU / Vodafone.',
  },
  {
    code: 'NN', currentSlug: 'crusaders-edicion-especial',
    name: 'Crusaders Local 2026 — 30 Años', slug: 'crusaders-local-2026-30-anos',
    brand: 'Classic', league: 'Super Rugby', nation: null, season: '2026',
    description: 'Rojo/negro/blanco. Edición 30° aniversario. Sponsor Coolabah.',
  },
  {
    code: 'OO', currentSlug: 'kenya-rugby-union',
    name: 'Kenya Local', slug: 'kenya-local',
    brand: 'Umbro', league: null, nation: 'Kenya', season: '2025',
    description: 'Coral/roja con diseño tribal. Sponsor SportPesa.',
  },
]

async function main() {
  console.log(`\n🔧 Corrigiendo ${FIXES.length} EncargoProducts — dos pasadas\n`)

  // ── Pasada 1: current slug → temporal único ────────────────────────────────
  console.log('── Pasada 1: slugs temporales ──────────────────────────────')
  let pass1Errors = 0
  for (const fix of FIXES) {
    const tempSlug = `tmp-${fix.code.toLowerCase()}-fix`
    const existing = await prisma.encargoProduct.findUnique({ where: { slug: fix.currentSlug } })
    if (!existing) {
      console.warn(`  ⚠️  [${fix.code}] No encontrado con slug "${fix.currentSlug}"`)
      pass1Errors++
      continue
    }
    await prisma.encargoProduct.update({
      where: { slug: fix.currentSlug },
      data: { slug: tempSlug },
    })
    process.stdout.write('.')
  }
  console.log(`\n  ✅ Pasada 1 lista (${FIXES.length - pass1Errors} renombrados, ${pass1Errors} errores)\n`)

  // ── Pasada 2: temporal → slug/nombre correcto definitivo ──────────────────
  console.log('── Pasada 2: datos correctos definitivos ───────────────────')
  let updated = 0
  let errors = 0
  for (const fix of FIXES) {
    const tempSlug = `tmp-${fix.code.toLowerCase()}-fix`
    const existing = await prisma.encargoProduct.findUnique({ where: { slug: tempSlug } })
    if (!existing) {
      console.warn(`  ⚠️  [${fix.code}] No encontrado con slug temporal "${tempSlug}"`)
      errors++
      continue
    }
    await prisma.encargoProduct.update({
      where: { slug: tempSlug },
      data: {
        name:        fix.name,
        slug:        fix.slug,
        brand:       fix.brand,
        description: fix.description,
        season:      fix.season  ?? null,
        nation:      fix.nation  ?? null,
        league:      fix.league  ?? null,
      },
    })
    console.log(`  ✅ [${fix.code}] → ${fix.name}`)
    updated++
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Actualizados: ${updated}`)
  if (errors) console.log(`❌ Errores: ${errors}`)

  console.log('\n⚠️  PENDIENTE: la foto de Ñ (Escocia Local Heritage) en Cloudinary')
  console.log('   muestra una camiseta de Springbok Sevens porque el archivo')
  console.log('   Ñ1.jpg colisionó con N1.jpg durante la subida (normalización ASCII).')
  console.log('   Hay que re-subir Ñ1.jpg y Ñ2.jpg con public_id diferente y')
  console.log('   actualizar el campo "images" del registro "escocia-local-heritage".')
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
