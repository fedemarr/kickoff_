/**
 * Re-sube Ñ1.jpg y Ñ2.jpg a Cloudinary con public_id único
 * y actualiza el registro "escocia-local-heritage" en la DB.
 *
 * El problema original: Ñ fue normalizado a N durante la subida,
 * así que ambos archivos (N y Ñ) terminaron con la misma URL.
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

const FILES = [
  { local: 'C:\\Users\\fede\\Downloads\\camisetasencargos\\Ñ1.jpg', publicId: 'kickoff/jerseys/escocia-heritage-1' },
  { local: 'C:\\Users\\fede\\Downloads\\camisetasencargos\\Ñ2.jpg', publicId: 'kickoff/jerseys/escocia-heritage-2' },
]

async function main() {
  const urls = []

  for (const file of FILES) {
    if (!fs.existsSync(file.local)) {
      console.error(`❌ No existe: ${file.local}`)
      process.exit(1)
    }

    console.log(`⬆️  Subiendo ${path.basename(file.local)} → ${file.publicId}`)
    const result = await cloudinary.uploader.upload(file.local, {
      public_id: file.publicId,
      overwrite: true,
      resource_type: 'image',
    })
    console.log(`   ✅ ${result.secure_url}`)
    urls.push(result.secure_url)
  }

  const updated = await prisma.encargoProduct.update({
    where: { slug: 'escocia-local-heritage' },
    data: { images: urls },
  })

  console.log(`\n✅ Registro actualizado: "${updated.name}" (${updated.slug})`)
  console.log(`   Fotos: ${urls.join(', ')}`)
}

main()
  .catch(err => { console.error('Error fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
