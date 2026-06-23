/**
 * Sube todas las fotos de jerseys a Cloudinary.
 * Uso: node scripts/upload-jerseys.js "C:\ruta\a\tus\fotos"
 *
 * Resultados en: scripts/upload-results.json
 * Después ejecutar: node scripts/seed-products.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')
const readline = require('readline')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function getImageFiles(dir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getImageFiles(full))
    } else if (IMAGE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(full)
    }
  }
  return results
}

function sanitize(name) {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quitar tildes
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}

async function uploadFile(filePath, folderPath) {
  const filename = path.basename(filePath, path.extname(filePath))
  const publicId = `kickoff/jerseys/${folderPath ? sanitize(folderPath) + '/' : ''}${sanitize(filename)}`

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: false,
    resource_type: 'image',
    quality: 'auto:good',
    fetch_format: 'auto',
  })

  return {
    file: filePath,
    filename: path.basename(filePath),
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  }
}

async function main() {
  const photosDir = process.argv[2]

  if (!photosDir) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    await new Promise(resolve => {
      rl.question('📁 Ruta a la carpeta con las fotos: ', (answer) => {
        process.argv[2] = answer.trim()
        rl.close()
        resolve()
      })
    })
  }

  const dir = process.argv[2]

  if (!fs.existsSync(dir)) {
    console.error(`❌ No existe la carpeta: ${dir}`)
    process.exit(1)
  }

  console.log(`\n☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`)
  console.log(`📂 Carpeta: ${dir}\n`)

  const files = getImageFiles(dir)
  if (files.length === 0) {
    console.error('❌ No se encontraron imágenes en esa carpeta.')
    process.exit(1)
  }

  console.log(`🖼️  ${files.length} imágenes encontradas\n`)

  const results = []
  let ok = 0
  let failed = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const rel = path.relative(dir, file)
    const subfolder = path.dirname(rel) !== '.' ? path.dirname(rel) : ''
    const progress = `[${i + 1}/${files.length}]`

    try {
      process.stdout.write(`${progress} Subiendo ${path.basename(file)}... `)
      const result = await uploadFile(file, subfolder)
      results.push(result)
      ok++
      console.log(`✅ ${result.url}`)
    } catch (err) {
      failed++
      const errMsg = err.message || String(err)
      results.push({ file, filename: path.basename(file), error: errMsg })
      console.log(`❌ Error: ${errMsg}`)
    }
  }

  const outputPath = path.join(__dirname, 'upload-results.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Subidas exitosas: ${ok}`)
  if (failed > 0) console.log(`❌ Fallidas: ${failed}`)
  console.log(`📄 Resultados guardados en: scripts/upload-results.json`)
  console.log(`\n▶ Próximo paso: node scripts/seed-products.js`)
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
