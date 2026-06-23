/**
 * 1. Borra los 42 productos draft (jersey-X-draft) que se crearon por error
 * 2. Crea los EncargoProduct con las mismas imágenes de Cloudinary
 *
 * Uso: node scripts/fix-to-encargos.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

function groupByCode(results) {
  const map = {}
  for (const r of results) {
    if (!r.url) continue
    const name = path.basename(r.filename, path.extname(r.filename))
    const match = name.match(/^([A-ZÁÉÍÓÚÑ]+)(\d+)$/i)
    if (!match) continue
    const code = match[1].toUpperCase()
    const num = parseInt(match[2], 10)
    if (!map[code]) map[code] = {}
    map[code][num] = r.url
  }
  return map
}

function sortCodes(codes) {
  return codes.sort((a, b) => {
    const len = a.length - b.length
    if (len !== 0) return len
    return a.localeCompare(b)
  })
}

async function main() {
  const resultsPath = path.join(__dirname, 'upload-results.json')
  if (!fs.existsSync(resultsPath)) {
    console.error('❌ No encontré scripts/upload-results.json')
    process.exit(1)
  }

  // 1. Borrar los Product drafts (primero variantes, luego productos)
  console.log('\n🗑️  Borrando productos draft...')
  const draftProducts = await prisma.product.findMany({
    where: { slug: { endsWith: '-draft' } },
    select: { id: true },
  })
  const draftIds = draftProducts.map(p => p.id)

  if (draftIds.length > 0) {
    await prisma.productVariant.deleteMany({ where: { productId: { in: draftIds } } })
    const deleted = await prisma.product.deleteMany({ where: { id: { in: draftIds } } })
    console.log(`   ${deleted.count} productos borrados\n`)
  } else {
    console.log('   Ninguno encontrado\n')
  }

  // 2. Crear EncargoProducts
  const uploadResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))
  const groups = groupByCode(uploadResults)
  const codes = sortCodes(Object.keys(groups))

  console.log(`🛍️  Creando ${codes.length} EncargoProducts...\n`)

  let created = 0
  let skipped = 0

  for (const code of codes) {
    const imgs = groups[code]
    const images = [imgs[1], imgs[2]].filter(Boolean)
    const slug = `encargo-${code.toLowerCase()}`
    const name = `Camiseta [${code}]`

    const exists = await prisma.encargoProduct.findUnique({ where: { slug } })
    if (exists) {
      console.log(`  ⏭  Ya existe: ${name}`)
      skipped++
      continue
    }

    await prisma.encargoProduct.create({
      data: {
        name,
        slug,
        brand: 'Por definir',
        description: null,
        images,
        active: true,
      },
    })

    console.log(`  ✅ ${name} (${images.length} imgs)`)
    created++
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ EncargoProducts creados: ${created}`)
  if (skipped > 0) console.log(`⏭  Ya existían: ${skipped}`)
  console.log(`\n💡 Entrá al admin → Encargos para renombrar cada camiseta.`)
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
