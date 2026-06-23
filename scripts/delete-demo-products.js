require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const DEMO_SLUGS = [
  'camiseta-los-pumas-local-2025',
  'camiseta-all-blacks-home-2024',
  'camiseta-springboks-away-2025',
  'camiseta-francia-local-2025',
  'camiseta-irlanda-home-2025',
  'camiseta-inglaterra-away-2024',
  'camiseta-leinster-alternativa-2025',
  'camiseta-stade-toulousain-2025',
  'camiseta-crusaders-2024',
  'pelota-gilbert-pro-match-t5',
  'botines-adidas-malice-sg',
  'casco-canterbury-pro',
]

async function main() {
  const products = await prisma.product.findMany({
    where: { slug: { in: DEMO_SLUGS } },
    select: { id: true, name: true },
  })
  console.log(`Encontrados ${products.length} productos demo para borrar:`)
  products.forEach(p => console.log(` - ${p.name}`))

  const ids = products.map(p => p.id)

  // Borrar OrderItems primero (FK)
  const oi = await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } })
  console.log(`\nOrderItems borrados: ${oi.count}`)

  // Borrar variantes
  const v = await prisma.productVariant.deleteMany({ where: { productId: { in: ids } } })
  console.log(`Variantes borradas: ${v.count}`)

  // Borrar productos
  const p = await prisma.product.deleteMany({ where: { id: { in: ids } } })
  console.log(`Productos borrados: ${p.count}`)

  const remaining = await prisma.product.count()
  console.log(`\nProductos restantes: ${remaining}`)
}

main().catch(err => { console.error(err); process.exit(1) }).finally(() => prisma.$disconnect())
