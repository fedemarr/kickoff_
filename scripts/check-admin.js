const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@kickoff.tienda' } })
  console.log('Admin user:', user ? { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password } : 'NO EXISTE')
}

main().catch(console.error).finally(() => prisma.$disconnect())
