import { PrismaClient, Category, Tag } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash('kickoff2025', 10)
  await prisma.user.upsert({
    where: { email: 'admin@kickoff.tienda' },
    update: {},
    create: {
      email: 'admin@kickoff.tienda',
      password: hashedPassword,
      name: 'Admin KickOff',
      role: 'ADMIN',
    },
  })

  // Site config
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  })

  // Products
  const products = [
    {
      name: 'Camiseta Los Pumas Local 2025',
      brand: 'Adidas',
      category: 'SELECCIONES' as Category,
      tag: 'NEW' as Tag,
      description: 'Camiseta oficial de Los Pumas para la temporada 2025.',
      details: 'Tela de alto rendimiento ClimaLite. Escudo bordado. Talle especial rugby: más amplio en hombros.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/1a1a1a/white?text=Pumas+2025'],
      variants: [
        { size: 'S', price: 89900, stock: 3 },
        { size: 'M', price: 89900, stock: 8 },
        { size: 'L', price: 89900, stock: 2 },
        { size: 'XL', price: 89900, stock: 0 },
        { size: 'XXL', price: 89900, stock: 4 },
      ],
    },
    {
      name: 'Camiseta All Blacks Home 2024',
      brand: 'Canterbury',
      category: 'SELECCIONES' as Category,
      tag: 'SALE' as Tag,
      description: 'Camiseta oficial de los All Blacks temporada 2024.',
      details: 'Material técnico de alta calidad. Diseño icónico negro con el helecho plateado.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/111111/white?text=All+Blacks+2024'],
      variants: [
        { size: 'S', price: 95900, oldPrice: 119900, stock: 4 },
        { size: 'M', price: 95900, oldPrice: 119900, stock: 6 },
        { size: 'L', price: 95900, oldPrice: 119900, stock: 3 },
        { size: 'XL', price: 95900, oldPrice: 119900, stock: 1 },
      ],
    },
    {
      name: 'Camiseta Springboks Away 2025',
      brand: 'Nike',
      category: 'SELECCIONES' as Category,
      tag: 'NONE' as Tag,
      description: 'Camiseta alternativa de los Springboks para 2025.',
      details: 'Tecnología Dri-FIT. Corte slim rugby. Colores vibrantes.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/1a6b1a/white?text=Springboks+2025'],
      variants: [
        { size: 'S', price: 79900, stock: 5 },
        { size: 'M', price: 79900, stock: 4 },
        { size: 'L', price: 79900, stock: 7 },
        { size: 'XL', price: 79900, stock: 3 },
      ],
    },
    {
      name: 'Camiseta Francia Local 2025',
      brand: 'Le Coq Sportif',
      category: 'SELECCIONES' as Category,
      tag: 'NEW' as Tag,
      description: 'Camiseta oficial del XV de France temporada 2025.',
      details: 'Diseño clásico azul marino con detalles rojos y blancos. Material transpirable.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/003399/white?text=Francia+2025'],
      variants: [
        { size: 'S', price: 85000, stock: 3 },
        { size: 'M', price: 85000, stock: 5 },
        { size: 'L', price: 85000, stock: 2 },
        { size: 'XL', price: 85000, stock: 4 },
      ],
    },
    {
      name: 'Camiseta Irlanda Home 2025',
      brand: 'Canterbury',
      category: 'SELECCIONES' as Category,
      tag: 'NEW' as Tag,
      description: 'Camiseta local de Irlanda para la temporada 2025.',
      details: 'Verde tradicional irlandés. Trébol bordado en el pecho. Fit rugby.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/006600/white?text=Irlanda+2025'],
      variants: [
        { size: 'S', price: 92000, stock: 2 },
        { size: 'M', price: 92000, stock: 4 },
        { size: 'L', price: 92000, stock: 6 },
        { size: 'XL', price: 92000, stock: 3 },
      ],
    },
    {
      name: 'Camiseta Inglaterra Away 2024',
      brand: 'Nike',
      category: 'SELECCIONES' as Category,
      tag: 'SALE' as Tag,
      description: 'Camiseta alternativa de Inglaterra temporada 2024.',
      details: 'Azul marino oscuro con detalles blancos. Escudo bordado.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/000080/white?text=Inglaterra+2024'],
      variants: [
        { size: 'S', price: 72000, oldPrice: 89900, stock: 3 },
        { size: 'M', price: 72000, oldPrice: 89900, stock: 2 },
        { size: 'L', price: 72000, oldPrice: 89900, stock: 4 },
      ],
    },
    {
      name: 'Camiseta Leinster Alternativa 2025',
      brand: 'Macron',
      category: 'CLUBES' as Category,
      tag: 'NEW' as Tag,
      description: 'Camiseta alternativa del Leinster Rugby Club 2025.',
      details: 'Diseño alternativo azul oscuro. Logo Macron en el pecho. Fit deportivo.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/003366/white?text=Leinster+2025'],
      variants: [
        { size: 'S', price: 74900, stock: 4 },
        { size: 'M', price: 74900, stock: 3 },
        { size: 'L', price: 74900, stock: 5 },
        { size: 'XL', price: 74900, stock: 2 },
      ],
    },
    {
      name: 'Camiseta Stade Toulousain 2025',
      brand: 'Adidas',
      category: 'CLUBES' as Category,
      tag: 'NONE' as Tag,
      description: 'Camiseta del Stade Toulousain temporada 2025.',
      details: 'Rojo y negro tradicionales del Stade. Material de alto rendimiento.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/cc0000/white?text=Toulouse+2025'],
      variants: [
        { size: 'S', price: 78000, stock: 3 },
        { size: 'M', price: 78000, stock: 5 },
        { size: 'L', price: 78000, stock: 4 },
        { size: 'XL', price: 78000, stock: 1 },
      ],
    },
    {
      name: 'Camiseta Crusaders 2024',
      brand: 'Canterbury',
      category: 'CLUBES' as Category,
      tag: 'SALE' as Tag,
      description: 'Camiseta de los Crusaders temporada 2024.',
      details: 'Rojo tradicional de los Crusaders. Fit ajustado para el rendimiento.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso y con etiquetas.',
      images: ['https://placehold.co/600x600/990000/white?text=Crusaders+2024'],
      variants: [
        { size: 'S', price: 65000, oldPrice: 82000, stock: 2 },
        { size: 'M', price: 65000, oldPrice: 82000, stock: 3 },
        { size: 'L', price: 65000, oldPrice: 82000, stock: 4 },
      ],
    },
    {
      name: 'Pelota Gilbert Pro Match T5',
      brand: 'Gilbert',
      category: 'EQUIPAMIENTO' as Category,
      tag: 'NEW' as Tag,
      description: 'Pelota oficial Gilbert talla 5 para partidos.',
      details: 'Cuero sintético de alta durabilidad. Válvula de precisión. Usada en competencias oficiales.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso.',
      images: ['https://placehold.co/600x600/8B4513/white?text=Gilbert+Pro+T5'],
      variants: [{ size: 'T5', price: 45000, stock: 10 }],
    },
    {
      name: 'Botines Adidas Malice SG',
      brand: 'Adidas',
      category: 'EQUIPAMIENTO' as Category,
      tag: 'NONE' as Tag,
      description: 'Botines Adidas Malice con tapones intercambiables.',
      details: 'Upper de cuero sintético. Tapones SG de aluminio intercambiables. Ideal para césped natural.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso.',
      images: ['https://placehold.co/600x600/333333/white?text=Adidas+Malice'],
      variants: [
        { size: '40', price: 95000, stock: 2 },
        { size: '41', price: 95000, stock: 3 },
        { size: '42', price: 95000, stock: 5 },
        { size: '43', price: 95000, stock: 4 },
        { size: '44', price: 95000, stock: 2 },
      ],
    },
    {
      name: 'Casco Canterbury Pro',
      brand: 'Canterbury',
      category: 'EQUIPAMIENTO' as Category,
      tag: 'NONE' as Tag,
      description: 'Casco de protección Canterbury para rugby.',
      details: 'EVA de alta densidad. Correas ajustables. Certificado IRB. Máxima protección.',
      returns: 'Aceptamos cambios dentro de los 30 días con el producto sin uso.',
      images: ['https://placehold.co/600x600/444444/white?text=Canterbury+Casco'],
      variants: [
        { size: 'S', price: 32000, stock: 4 },
        { size: 'M', price: 32000, stock: 6 },
        { size: 'L', price: 32000, stock: 3 },
      ],
    },
  ]

  for (const p of products) {
    const slug = slugify(p.name)
    const { variants, ...productData } = p

    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        ...productData,
        slug,
        featured: ['Camiseta Los Pumas Local 2025', 'Camiseta All Blacks Home 2024', 'Camiseta Springboks Away 2025'].includes(p.name),
      },
    })

    for (const v of variants) {
      const existingVariant = await prisma.productVariant.findFirst({
        where: { productId: product.id, size: v.size },
      })
      if (!existingVariant) {
        await prisma.productVariant.create({
          data: { ...v, productId: product.id },
        })
      }
    }
  }

  // Encargo products (sin precio ni stock)
  const encargoProducts = [
    {
      name: 'Camiseta Los Pumas Mundial 2023',
      brand: 'Adidas',
      nation: 'Argentina',
      season: '2023',
      origin: 'Local',
      league: 'UAR',
      images: ['https://placehold.co/600x600/75b2dd/white?text=Pumas+Mundial'],
    },
    {
      name: 'Camiseta All Blacks Retro 2011',
      brand: 'Adidas',
      nation: 'Nueva Zelanda',
      season: '2011',
      origin: 'Retro',
      league: 'NZRU',
      images: ['https://placehold.co/600x600/111111/white?text=AB+Retro+2011'],
    },
    {
      name: 'Camiseta British Lions 2025',
      brand: 'Canterbury',
      nation: 'British & Irish Lions',
      season: '2025',
      origin: 'Local',
      league: 'B&I Lions',
      images: ['https://placehold.co/600x600/cc0000/white?text=British+Lions'],
    },
  ]

  for (const ep of encargoProducts) {
    const slug = slugify(ep.name)
    await prisma.encargoProduct.upsert({
      where: { slug },
      update: {},
      create: { ...ep, slug },
    })
  }

  console.log('Seed completado ✓')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
