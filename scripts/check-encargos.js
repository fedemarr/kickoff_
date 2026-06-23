require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const total = await prisma.encargoProduct.count()
  const activos = await prisma.encargoProduct.count({ where: { active: true } })
  console.log(`Total EncargoProducts: ${total}`)
  console.log(`Activos: ${activos}`)
  const muestras = await prisma.encargoProduct.findMany({ take: 3, select: { name: true, active: true } })
  muestras.forEach(p => console.log(` - [${p.active ? 'activo' : 'INACTIVO'}] ${p.name}`))
  console.log('\nDATABASE_URL apunta a:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':***@'))
}

main().catch(console.error).finally(() => prisma.$disconnect())
