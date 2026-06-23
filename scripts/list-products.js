require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, active: true, tag: true, category: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  console.log(`Total: ${products.length}\n`)
  products.forEach((p, i) => console.log(`${i+1}. [${p.active ? 'ACT' : 'ina'}] [${p.tag}] [${p.category}] ${p.name}  (${p.slug})`))
}
main().catch(console.error).finally(() => prisma.$disconnect())
