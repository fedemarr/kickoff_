require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
prisma.encargoProduct.update({
  where: { slug: 'encargo-kk' },
  data: { name: 'Australia Wallabies Away', slug: 'wallabies-away', brand: 'Castore', nation: 'Australia', season: '2025', description: 'Camiseta suplente Australia Wallabies. Sponsors Cadbury / Santos.' }
}).then(r => console.log('✅', r.name)).catch(console.error).finally(() => prisma.$disconnect())
