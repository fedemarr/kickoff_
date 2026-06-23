require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Actualizar precio de todas las variantes a $113.000
  const variants = await prisma.productVariant.updateMany({
    data: { price: 113000 },
  })
  console.log(`✅ ${variants.count} variantes → $113.000`)

  // 2. Actualizar SiteConfig: transferDiscount = 23%
  //    $113.000 × 0.77 = $87.010 ≈ $87.000
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {
      transferDiscount: 23,
      bannerText: '3 cuotas sin interés · 23% OFF pagando por transferencia',
    },
    create: {
      id: 'main',
      transferDiscount: 23,
      bannerText: '3 cuotas sin interés · 23% OFF pagando por transferencia',
    },
  })
  console.log('✅ SiteConfig → transferDiscount=23%, bannerText actualizado')

  // Verificación
  const sample = await prisma.productVariant.findFirst({ select: { price: true, size: true, product: { select: { name: true } } } })
  console.log(`\nEjemplo: ${sample.product.name} talle ${sample.size} = $${sample.price}`)
  console.log(`  Transfer (23% off): $${Math.round(sample.price * 0.77)}`)
  console.log(`  3 cuotas de: $${Math.round(sample.price / 3)}`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
