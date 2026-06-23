/**
 * Sube fotos de stock a Cloudinary y crea los Product + ProductVariant
 * correspondientes en la DB.
 *
 * Productos:
 *   1. All Blacks Local 2025      M / L / XXL
 *   2. Francia 120° Aniversario   M / L / XXL
 *   3. Escocia Murrayfield 2025   M
 *   4. Māori All Blacks Rau Tau   M
 *   5. Vodacom Bulls Local        M / L / XL
 *   6. Gales Local 2025           XXXL
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const cloudinary = require('cloudinary').v2
const { PrismaClient } = require('@prisma/client')
const path = require('path')
const fs = require('fs')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const prisma = new PrismaClient()

const BASE = 'C:\\Users\\fede\\Downloads'
const PRICE = 97000  // 10% off = ~$87.000 por transferencia

const PRODUCTS = [
  {
    name:        'All Blacks Local 2025',
    slug:        'all-blacks-local-2025',
    brand:       'Adidas',
    category:    'SELECCIONES',
    nation:      'Nueva Zelanda',
    description: 'Camiseta local All Blacks 2025. Sponsor Altrad.',
    tag:         'NEW',
    files:       ['allblackstock.jpg'],
    variants: [
      { size: 'M',   stock: 1 },
      { size: 'L',   stock: 1 },
      { size: 'XXL', stock: 1 },
    ],
  },
  {
    name:        'Francia Rugby 120° Aniversario',
    slug:        'francia-rugby-120-aniversario',
    brand:       'Adidas Originals',
    category:    'SELECCIONES',
    nation:      'Francia',
    description: 'Camiseta retro Francia Rugby 120° Aniversario. Edición especial Adidas Originals.',
    tag:         'NEW',
    files:       ['francia120aniversariorugby.jpeg', 'francia120aniversariostock.jpeg'],
    variants: [
      { size: 'M',   stock: 1 },
      { size: 'L',   stock: 1 },
      { size: 'XXL', stock: 1 },
    ],
  },
  {
    name:        'Escocia Local 2025 — Murrayfield',
    slug:        'escocia-local-2025-murrayfield',
    brand:       'Macron',
    category:    'SELECCIONES',
    nation:      'Escocia',
    description: 'Camiseta local Escocia 2025. Edición centenario Murrayfield Stadium 1925-2025. Sponsor Arnold Clark.',
    tag:         'NEW',
    files:       ['scotlandazulstock.jpg', 'scotlandbrazo.jpg', 'scotlanddeespalda.jpg'],
    variants: [
      { size: 'M', stock: 1 },
    ],
  },
  {
    name:        'Māori All Blacks — Rau Tau',
    slug:        'maori-all-blacks-rau-tau',
    brand:       'Adidas',
    category:    'SELECCIONES',
    nation:      'Nueva Zelanda',
    description: 'Camiseta Māori All Blacks edición centenaria "Rau Tau — 100 Years of Maori Rugby".',
    tag:         'NEW',
    files:       ['maoriallbalcksstock.jpg'],
    variants: [
      { size: 'M', stock: 1 },
    ],
  },
  {
    name:        'Vodacom Bulls Local',
    slug:        'bulls-local-vodacom',
    brand:       'Puma',
    category:    'CLUBES',
    league:      'Super Rugby',
    description: 'Camiseta local Vodacom Bulls Super Rugby. Sponsor Vodacom.',
    tag:         'NEW',
    files:       ['bullsrugbystock.jpg'],
    variants: [
      { size: 'M',  stock: 1 },
      { size: 'L',  stock: 1 },
      { size: 'XL', stock: 1 },
    ],
  },
  {
    name:        'Gales Local 2025',
    slug:        'gales-local-2025-stock',
    brand:       'Macron',
    category:    'SELECCIONES',
    nation:      'Gales',
    description: 'Camiseta local Gales 2025. Sponsors WRU / Vodafone / Go.Compare.',
    tag:         'NEW',
    files:       ['welshrugbystock.jpg', 'welshrugbystockespalda.jpg'],
    variants: [
      { size: 'XXXL', stock: 1 },
    ],
  },
]

async function uploadFile(localPath, publicId) {
  if (!fs.existsSync(localPath)) throw new Error(`No existe: ${localPath}`)
  const result = await cloudinary.uploader.upload(localPath, {
    public_id:     publicId,
    overwrite:     false,
    resource_type: 'image',
  })
  return result.secure_url
}

async function main() {
  console.log('\n🚀 Subiendo fotos y creando productos de stock\n')

  for (const product of PRODUCTS) {
    console.log(`\n📦 ${product.name}`)

    // 1. Subir fotos
    const urls = []
    for (let i = 0; i < product.files.length; i++) {
      const file = product.files[i]
      const localPath = path.join(BASE, file)
      const ext = path.extname(file)
      const base = path.basename(file, ext)
      const publicId = `kickoff/products/${product.slug}-${i + 1}`

      process.stdout.write(`   ⬆️  ${file} → `)
      const url = await uploadFile(localPath, publicId)
      console.log(url.split('/').slice(-2).join('/'))
      urls.push(url)
    }

    // 2. Crear Product
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } })
    if (existing) {
      console.log(`   ⚠️  Ya existe (${product.slug}), actualizando imágenes...`)
      await prisma.product.update({
        where: { slug: product.slug },
        data: { images: urls, active: true },
      })
    } else {
      const created = await prisma.product.create({
        data: {
          name:        product.name,
          slug:        product.slug,
          brand:       product.brand,
          category:    product.category,
          description: product.description,
          tag:         product.tag ?? 'NONE',
          images:      urls,
          active:      true,
          featured:    false,
          ...(product.nation ? {} : {}), // nation/league are not in Product model; stored in description
          variants: {
            create: product.variants.map(v => ({
              size:  v.size,
              price: PRICE,
              stock: v.stock,
            })),
          },
        },
      })
      const varCount = product.variants.length
      console.log(`   ✅ Creado: ${created.name} — ${varCount} talle${varCount > 1 ? 's' : ''}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  const total = await prisma.product.count({ where: { active: true } })
  console.log(`✅ Total productos activos en la tienda: ${total}`)
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
