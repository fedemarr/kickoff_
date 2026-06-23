require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('⬆️  Subiendo introkickoff.mp4 a Cloudinary...')
cloudinary.uploader.upload(
  'C:\\Users\\fede\\Downloads\\introkickoff.mp4',
  {
    public_id:     'kickoff/intro/introkickoff',
    resource_type: 'video',
    overwrite:     true,
  },
  (err, result) => {
    if (err) { console.error('❌', err); process.exit(1) }
    console.log('✅ Video subido:')
    console.log('   URL:', result.secure_url)
    console.log('   Duración:', result.duration, 'seg')
    console.log('   Resolución:', result.width, 'x', result.height)
  }
)
