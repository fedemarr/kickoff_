const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@kickoff.tienda' } })
  const valid = await bcrypt.compare('kickoff2025', user.password)
  console.log('Password válido:', valid)
  if (!valid) {
    // Reset password
    const newHash = await bcrypt.hash('kickoff2025', 12)
    await prisma.user.update({ where: { email: 'admin@kickoff.tienda' }, data: { password: newHash } })
    console.log('Password reseteado correctamente')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
