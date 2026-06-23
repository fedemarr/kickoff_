require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const r = await prisma.product.updateMany({ where: { active: true }, data: { featured: true } })
  console.log(`✅ ${r.count} productos marcados como featured`)
}
main().catch(console.error).finally(() => prisma.$disconnect())
