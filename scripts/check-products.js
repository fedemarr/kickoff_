const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log('Productos en DB:', count)
  const products = await prisma.product.findMany({ take: 3, select: { name: true, featured: true, tag: true } })
  console.log(products)
}

main().catch(console.error).finally(() => prisma.$disconnect())
