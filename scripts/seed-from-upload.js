/**
 * Crea productos en la DB agrupando las fotos por código de letra.
 * A1+A2 → producto "Jersey A", AA1+AA2 → "Jersey AA", etc.
 * Después podés renombrarlos desde el admin.
 *
 * Uso: node scripts/seed-from-upload.js
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
    // "A1" → code="A", n=1 | "AA2" → code="AA", n=2
    const match = name.match(/^([A-ZÁÉÍÓÚÑ]+)(\d+)$/i)
    if (!match) continue

    const code = match[1].toUpperCase()
    const num = parseInt(match[2], 10)

    if (!map[code]) map[code] = {}
    map[code][num] = r.url
  }

  return map
}

// Orden lógico: A, AA, B, BB, C, CC, ...
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

  const uploadResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))
  const groups = groupByCode(uploadResults)
  const codes = sortCodes(Object.keys(groups))

  console.log(`\n🖼️  Grupos detectados: ${codes.length}`)
  console.log('   Códigos:', codes.join(', '), '\n')

  // Mostrar preview
  const previewLines = []
  for (const code of codes) {
    const imgs = groups[code]
    const count = Object.keys(imgs).length
    previewLines.push(`  ${code.padEnd(4)} → ${count} foto(s) → ${imgs[1] || '(sin foto 1)'}`)
  }
  console.log(previewLines.join('\n'))
  console.log()

  let created = 0
  let skipped = 0

  for (const code of codes) {
    const imgs = groups[code]
    const images = [imgs[1], imgs[2]].filter(Boolean)

    const slug = `jersey-${code.toLowerCase()}-draft`
    const name = `Camiseta [${code}] — Renombrar`

    const exists = await prisma.product.findUnique({ where: { slug } })
    if (exists) {
      console.log(`  ⏭  Ya existe: ${name}`)
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        brand: 'Por definir',
        category: 'SELECCIONES',
        description: null,
        images,
        tag: 'NONE',
        active: false, // oculto hasta que le pongas el nombre real
        featured: false,
        variants: {
          create: [
            { size: 'S',   price: 90000, stock: 5 },
            { size: 'M',   price: 90000, stock: 5 },
            { size: 'L',   price: 90000, stock: 5 },
            { size: 'XL',  price: 90000, stock: 5 },
            { size: '2XL', price: 90000, stock: 5 },
          ],
        },
      },
    })

    console.log(`  ✅ Creado: ${name} (${images.length} imgs)`)
    created++
  }

  // Guardar preview en JSON para referencia
  const preview = codes.map(code => ({
    code,
    slug: `jersey-${code.toLowerCase()}-draft`,
    foto1: groups[code][1] || null,
    foto2: groups[code][2] || null,
  }))
  fs.writeFileSync(
    path.join(__dirname, 'productos-draft.json'),
    JSON.stringify(preview, null, 2),
    'utf-8'
  )

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Productos creados: ${created}`)
  if (skipped > 0) console.log(`⏭  Ya existían: ${skipped}`)
  console.log(`📄 URLs guardadas en: scripts/productos-draft.json`)
  console.log(`\n💡 Los productos están ocultos (active: false).`)
  console.log(`   Entrá al admin, cambiá nombre/marca/categoría y activá cada uno.`)
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
