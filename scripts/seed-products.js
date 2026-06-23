/**
 * Crea los productos en la DB a partir de upload-results.json
 * Uso: node scripts/seed-products.js
 *
 * Requiere haber ejecutado antes: node scripts/upload-jerseys.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// ─── CATÁLOGO ──────────────────────────────────────────────────────────────
// Ajustá "images" con los nombres de archivo de tus fotos (sin extensión).
// Cada string debe matchear el campo "filename" del upload-results.json.
// Los precios están en ARS — ajustalos antes de correr el script.
// ────────────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  // ═══════════════════════════════ SELECCIONES ══════════════════════════════

  {
    name: 'Camiseta Irlanda Canterbury Local 2025',
    slug: 'irlanda-canterbury-local-2025',
    brand: 'Canterbury',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Irlanda local 2025. Diseño smoke con detalles en verde oscuro.',
    images: [], // se completa automáticamente desde upload-results.json
    imageKeys: ['irlanda_local_2025', 'irlanda_local_2025_back'], // nombres de archivo (sin ext)
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
      { size: '2XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Irlanda Canterbury Clásica',
    slug: 'irlanda-canterbury-clasica',
    brand: 'Canterbury',
    category: 'SELECCIONES',
    description: 'Camiseta clásica de Irlanda Canterbury, diseño verde tradicional.',
    images: [],
    imageKeys: ['irlanda_clasica', 'irlanda_clasica_back'],
    variants: [
      { size: 'S', price: 90000 },
      { size: 'M', price: 90000 },
      { size: 'L', price: 90000 },
      { size: 'XL', price: 90000 },
      { size: '2XL', price: 90000 },
    ],
  },
  {
    name: 'Camiseta Irlanda Canterbury Away 2025',
    slug: 'irlanda-canterbury-away-2025',
    brand: 'Canterbury',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Irlanda alternativa 2025.',
    images: [],
    imageKeys: ['irlanda_away_2025', 'irlanda_away_2025_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Irlanda Canterbury Alternativa Psicodélica',
    slug: 'irlanda-canterbury-alternativa-psicodemica',
    brand: 'Canterbury',
    category: 'SELECCIONES',
    description: 'Edición especial psicodélica de Irlanda Canterbury.',
    images: [],
    imageKeys: ['irlanda_psico', 'irlanda_psico_back'],
    variants: [
      { size: 'S', price: 98000 },
      { size: 'M', price: 98000 },
      { size: 'L', price: 98000 },
      { size: 'XL', price: 98000 },
    ],
  },

  // Springboks
  {
    name: 'Camiseta Springboks Nike Local Kaleidoscopio',
    slug: 'springboks-nike-local-kaleidoscopio',
    brand: 'Nike',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Springboks local, diseño Kaleidoscopio.',
    images: [],
    imageKeys: ['springboks_local_kalidoscopio', 'springboks_local_kalidoscopio_back'],
    variants: [
      { size: 'S', price: 100000 },
      { size: 'M', price: 100000 },
      { size: 'L', price: 100000 },
      { size: 'XL', price: 100000 },
      { size: '2XL', price: 100000 },
    ],
  },
  {
    name: 'Camiseta Springboks Nike Away FNB',
    slug: 'springboks-nike-away-fnb',
    brand: 'Nike',
    category: 'SELECCIONES',
    description: 'Camiseta alternativa blanca Springboks FNB.',
    images: [],
    imageKeys: ['springboks_away_fnb', 'springboks_away_fnb_back'],
    variants: [
      { size: 'S', price: 100000 },
      { size: 'M', price: 100000 },
      { size: 'L', price: 100000 },
      { size: 'XL', price: 100000 },
    ],
  },
  {
    name: 'Camiseta Springboks Nike Home Verde FNB',
    slug: 'springboks-nike-home-verde-fnb',
    brand: 'Nike',
    category: 'SELECCIONES',
    description: 'Camiseta local verde Springboks FNB.',
    images: [],
    imageKeys: ['springboks_home_fnb', 'springboks_home_fnb_back'],
    variants: [
      { size: 'S', price: 100000 },
      { size: 'M', price: 100000 },
      { size: 'L', price: 100000 },
      { size: 'XL', price: 100000 },
    ],
  },
  {
    name: 'Camiseta Springboks Nike Promo Multicolor',
    slug: 'springboks-nike-promo-multicolor',
    brand: 'Nike',
    category: 'SELECCIONES',
    description: 'Edición promo multicolor Springboks.',
    images: [],
    imageKeys: ['springboks_promo', 'springboks_promo_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },

  // Escocia
  {
    name: 'Camiseta Escocia Macron Local 2025',
    slug: 'escocia-macron-local-2025',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Escocia local 2025.',
    images: [],
    imageKeys: ['escocia_local_2025', 'escocia_local_2025_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },
  {
    name: 'Camiseta Escocia Macron Third Rosa',
    slug: 'escocia-macron-third-rosa',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Tercera camiseta Escocia Macron en rosa.',
    images: [],
    imageKeys: ['escocia_third_rosa', 'escocia_third_rosa_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },
  {
    name: 'Camiseta Escocia Macron Local 2026',
    slug: 'escocia-macron-local-2026',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Escocia local 2026.',
    images: [],
    imageKeys: ['escocia_local_2026', 'escocia_local_2026_back'],
    variants: [
      { size: 'S', price: 92000 },
      { size: 'M', price: 92000 },
      { size: 'L', price: 92000 },
      { size: 'XL', price: 92000 },
    ],
    tag: 'NEW',
  },

  // Kenya
  {
    name: 'Camiseta Kenya Umbro Local Tribal',
    slug: 'kenya-umbro-local-tribal',
    brand: 'Umbro',
    category: 'SELECCIONES',
    description: 'Camiseta Simbas de Kenya local, diseño tribal rojo.',
    images: [],
    imageKeys: ['kenya_local', 'kenya_local_back'],
    variants: [
      { size: 'S', price: 80000 },
      { size: 'M', price: 80000 },
      { size: 'L', price: 80000 },
      { size: 'XL', price: 80000 },
    ],
  },
  {
    name: 'Camiseta Kenya Umbro Away',
    slug: 'kenya-umbro-away',
    brand: 'Umbro',
    category: 'SELECCIONES',
    description: 'Camiseta alternativa blanca de Kenya Umbro.',
    images: [],
    imageKeys: ['kenya_away', 'kenya_away_back'],
    variants: [
      { size: 'S', price: 80000 },
      { size: 'M', price: 80000 },
      { size: 'L', price: 80000 },
      { size: 'XL', price: 80000 },
    ],
  },

  // Springbok Sevens
  {
    name: 'Camiseta Springbok Sevens Nike',
    slug: 'springbok-sevens-nike',
    brand: 'Nike',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Springbok Sevens Nike.',
    images: [],
    imageKeys: ['springbok_sevens', 'springbok_sevens_back'],
    variants: [
      { size: 'S', price: 92000 },
      { size: 'M', price: 92000 },
      { size: 'L', price: 92000 },
      { size: 'XL', price: 92000 },
    ],
  },

  // Wallabies
  {
    name: 'Camiseta Wallabies Castore Indigenous Naranja',
    slug: 'wallabies-castore-indigenous',
    brand: 'Castore',
    category: 'SELECCIONES',
    description: 'Camiseta Australia Wallabies Castore, diseño indigenous naranja.',
    images: [],
    imageKeys: ['wallabies_indigenous', 'wallabies_indigenous_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },

  // Wallaroos
  {
    name: 'Camiseta Wallaroos Castore',
    slug: 'wallaroos-castore',
    brand: 'Castore',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Australia Wallaroos Castore blanca.',
    images: [],
    imageKeys: ['wallaroos', 'wallaroos_back'],
    variants: [
      { size: 'S', price: 90000 },
      { size: 'M', price: 90000 },
      { size: 'L', price: 90000 },
      { size: 'XL', price: 90000 },
    ],
  },

  // Māori All Blacks
  {
    name: 'Camiseta Māori All Blacks Adidas',
    slug: 'maori-all-blacks-adidas',
    brand: 'Adidas',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Māori All Blacks Adidas con diseño Māori.',
    images: [],
    imageKeys: ['maori_all_blacks', 'maori_all_blacks_back'],
    variants: [
      { size: 'S', price: 105000 },
      { size: 'M', price: 105000 },
      { size: 'L', price: 105000 },
      { size: 'XL', price: 105000 },
    ],
  },

  // Inglaterra
  {
    name: 'Camiseta Inglaterra Castore Training',
    slug: 'inglaterra-castore-training',
    brand: 'Castore',
    category: 'SELECCIONES',
    description: 'Camiseta de entrenamiento oficial England Rugby Castore.',
    images: [],
    imageKeys: ['inglaterra_training', 'inglaterra_training_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },

  // Gales
  {
    name: 'Camiseta Gales Macron Local',
    slug: 'gales-macron-local',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Camiseta oficial Gales Macron local roja.',
    images: [],
    imageKeys: ['gales_local', 'gales_local_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },
  {
    name: 'Camiseta Gales Macron Away',
    slug: 'gales-macron-away',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Camiseta alternativa blanca de Gales Macron.',
    images: [],
    imageKeys: ['gales_away', 'gales_away_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },

  // Connacht
  {
    name: 'Camiseta Connacht Macron 140° Aniversario',
    slug: 'connacht-macron-140-aniversario',
    brand: 'Macron',
    category: 'SELECCIONES',
    description: 'Edición especial 140° aniversario del Connacht Rugby.',
    images: [],
    imageKeys: ['connacht_140', 'connacht_140_back'],
    variants: [
      { size: 'S', price: 90000 },
      { size: 'M', price: 90000 },
      { size: 'L', price: 90000 },
      { size: 'XL', price: 90000 },
    ],
  },

  // ════════════════════════════════════ CLUBES ══════════════════════════════

  // Crusaders
  {
    name: 'Camiseta Crusaders Classic Local 30 Años',
    slug: 'crusaders-classic-local-30-anos',
    brand: 'Classic',
    category: 'CLUBES',
    description: 'Edición especial 30 años Crusaders, camiseta local roja.',
    images: [],
    imageKeys: ['crusaders_local_30', 'crusaders_local_30_back'],
    variants: [
      { size: 'S', price: 85000 },
      { size: 'M', price: 85000 },
      { size: 'L', price: 85000 },
      { size: 'XL', price: 85000 },
    ],
  },
  {
    name: 'Camiseta Crusaders Classic Away 30 Años',
    slug: 'crusaders-classic-away-30-anos',
    brand: 'Classic',
    category: 'CLUBES',
    description: 'Edición especial 30 años Crusaders, camiseta away negra.',
    images: [],
    imageKeys: ['crusaders_away_30', 'crusaders_away_30_back'],
    variants: [
      { size: 'S', price: 85000 },
      { size: 'M', price: 85000 },
      { size: 'L', price: 85000 },
      { size: 'XL', price: 85000 },
    ],
  },

  // Hurricanes
  {
    name: 'Camiseta Hurricanes Classic Amarillo',
    slug: 'hurricanes-classic-amarillo',
    brand: 'Classic',
    category: 'CLUBES',
    description: 'Camiseta Hurricanes Classic en amarillo.',
    images: [],
    imageKeys: ['hurricanes', 'hurricanes_back'],
    variants: [
      { size: 'S', price: 85000 },
      { size: 'M', price: 85000 },
      { size: 'L', price: 85000 },
      { size: 'XL', price: 85000 },
    ],
  },

  // Chiefs
  {
    name: 'Camiseta Gallagher Chiefs Classic Away Māori',
    slug: 'chiefs-classic-away-maori',
    brand: 'Classic',
    category: 'CLUBES',
    description: 'Camiseta alternativa blanca Gallagher Chiefs con diseño Māori.',
    images: [],
    imageKeys: ['chiefs_away_maori', 'chiefs_away_maori_back'],
    variants: [
      { size: 'S', price: 87000 },
      { size: 'M', price: 87000 },
      { size: 'L', price: 87000 },
      { size: 'XL', price: 87000 },
    ],
  },
  {
    name: 'Camiseta Gallagher Chiefs Classic Local Māori',
    slug: 'chiefs-classic-local-maori',
    brand: 'Classic',
    category: 'CLUBES',
    description: 'Camiseta local negra Gallagher Chiefs con diseño Māori.',
    images: [],
    imageKeys: ['chiefs_local_maori', 'chiefs_local_maori_back'],
    variants: [
      { size: 'S', price: 87000 },
      { size: 'M', price: 87000 },
      { size: 'L', price: 87000 },
      { size: 'XL', price: 87000 },
    ],
  },

  // Fiji Drua
  {
    name: 'Camiseta Fiji Drua New Balance',
    slug: 'fiji-drua-new-balance',
    brand: 'New Balance',
    category: 'CLUBES',
    description: 'Camiseta oficial Fiji Drua New Balance.',
    images: [],
    imageKeys: ['fiji_drua', 'fiji_drua_back'],
    variants: [
      { size: 'S', price: 90000 },
      { size: 'M', price: 90000 },
      { size: 'L', price: 90000 },
      { size: 'XL', price: 90000 },
    ],
  },

  // Stade Toulousain
  {
    name: 'Camiseta Stade Toulousain Nike Local',
    slug: 'stade-toulousain-nike-local',
    brand: 'Nike',
    category: 'CLUBES',
    description: 'Camiseta oficial Stade Toulousain local roja.',
    images: [],
    imageKeys: ['toulouse_local', 'toulouse_local_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Stade Toulousain Nike Away Crema',
    slug: 'stade-toulousain-nike-away-crema',
    brand: 'Nike',
    category: 'CLUBES',
    description: 'Camiseta alternativa crema del Stade Toulousain Nike.',
    images: [],
    imageKeys: ['toulouse_away', 'toulouse_away_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Stade Toulousain Nike Third Liquid',
    slug: 'stade-toulousain-nike-third-liquid',
    brand: 'Nike',
    category: 'CLUBES',
    description: 'Tercera camiseta Stade Toulousain Nike, diseño Liquid negra/roja.',
    images: [],
    imageKeys: ['toulouse_third_liquid', 'toulouse_third_liquid_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Stade Toulousain Nike Training Neón',
    slug: 'stade-toulousain-nike-training-neon',
    brand: 'Nike',
    category: 'CLUBES',
    description: 'Camiseta de entrenamiento Stade Toulousain Nike, color neón.',
    images: [],
    imageKeys: ['toulouse_training', 'toulouse_training_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },
  {
    name: 'Camiseta Stade Toulousain Nike Third Tolosa',
    slug: 'stade-toulousain-nike-third-tolosa',
    brand: 'Nike',
    category: 'CLUBES',
    description: 'Tercera camiseta Stade Toulousain edición especial "Tolosa".',
    images: [],
    imageKeys: ['toulouse_third_tolosa', 'toulouse_third_tolosa_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },

  // Harlequins
  {
    name: 'Camiseta Harlequins Castore Local Cuartos',
    slug: 'harlequins-castore-local',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta local oficial Harlequins Castore, diseño cuartos clásico.',
    images: [],
    imageKeys: ['harlequins_local', 'harlequins_local_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Harlequins Castore Cup Fireworks',
    slug: 'harlequins-castore-cup-fireworks',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta Harlequins Castore edición Cup Fireworks.',
    images: [],
    imageKeys: ['harlequins_fireworks', 'harlequins_fireworks_back'],
    variants: [
      { size: 'S', price: 98000 },
      { size: 'M', price: 98000 },
      { size: 'L', price: 98000 },
      { size: 'XL', price: 98000 },
    ],
  },
  {
    name: 'Camiseta Harlequins Castore Away Rosa',
    slug: 'harlequins-castore-away-rosa',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta alternativa rosa Harlequins Castore.',
    images: [],
    imageKeys: ['harlequins_away', 'harlequins_away_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },

  // Leinster
  {
    name: 'Camiseta Leinster Castore Local Mapa',
    slug: 'leinster-castore-local-mapa',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta local Leinster Castore con diseño mapa azul.',
    images: [],
    imageKeys: ['leinster_local', 'leinster_local_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },
  {
    name: 'Camiseta Leinster Castore Away Blanca Dorada',
    slug: 'leinster-castore-away-blanca-dorada',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta alternativa blanca y dorada de Leinster Castore.',
    images: [],
    imageKeys: ['leinster_away', 'leinster_away_back'],
    variants: [
      { size: 'S', price: 95000 },
      { size: 'M', price: 95000 },
      { size: 'L', price: 95000 },
      { size: 'XL', price: 95000 },
    ],
  },

  // Cardiff
  {
    name: 'Camiseta Cardiff Macron',
    slug: 'cardiff-macron',
    brand: 'Macron',
    category: 'CLUBES',
    description: 'Camiseta oficial Cardiff Rugby Macron.',
    images: [],
    imageKeys: ['cardiff', 'cardiff_back'],
    variants: [
      { size: 'S', price: 85000 },
      { size: 'M', price: 85000 },
      { size: 'L', price: 85000 },
      { size: 'XL', price: 85000 },
    ],
  },

  // Northampton Saints
  {
    name: 'Camiseta Northampton Saints Macron',
    slug: 'northampton-saints-macron',
    brand: 'Macron',
    category: 'CLUBES',
    description: 'Camiseta oficial Northampton Saints Macron.',
    images: [],
    imageKeys: ['northampton', 'northampton_back'],
    variants: [
      { size: 'S', price: 88000 },
      { size: 'M', price: 88000 },
      { size: 'L', price: 88000 },
      { size: 'XL', price: 88000 },
    ],
  },

  // Ulster
  {
    name: 'Camiseta Ulster Castore Local',
    slug: 'ulster-castore-local',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta local Ulster Castore blanca y roja.',
    images: [],
    imageKeys: ['ulster_local', 'ulster_local_back'],
    variants: [
      { size: 'S', price: 92000 },
      { size: 'M', price: 92000 },
      { size: 'L', price: 92000 },
      { size: 'XL', price: 92000 },
    ],
  },
  {
    name: 'Camiseta Ulster Castore Away Negra',
    slug: 'ulster-castore-away-negra',
    brand: 'Castore',
    category: 'CLUBES',
    description: 'Camiseta alternativa negra Ulster Castore.',
    images: [],
    imageKeys: ['ulster_away', 'ulster_away_back'],
    variants: [
      { size: 'S', price: 92000 },
      { size: 'M', price: 92000 },
      { size: 'L', price: 92000 },
      { size: 'XL', price: 92000 },
    ],
  },
]

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  const resultsPath = path.join(__dirname, 'upload-results.json')

  if (!fs.existsSync(resultsPath)) {
    console.error('❌ No encontré scripts/upload-results.json')
    console.error('   Primero ejecutá: node scripts/upload-jerseys.js <carpeta>')
    process.exit(1)
  }

  const uploadResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'))

  // Construir mapa filename → URL
  const urlMap = {}
  for (const r of uploadResults) {
    if (r.url) {
      const nameWithoutExt = path.basename(r.filename, path.extname(r.filename)).toLowerCase()
      urlMap[nameWithoutExt] = r.url
    }
  }

  console.log(`\n📦 URLs disponibles en upload-results.json: ${Object.keys(urlMap).length}`)
  console.log(`🛍️  Productos a crear: ${PRODUCTS.length}\n`)

  let created = 0
  let skipped = 0
  let warnings = 0

  for (const product of PRODUCTS) {
    // Buscar imágenes por imageKeys
    const images = []
    for (const key of product.imageKeys) {
      const url = urlMap[key.toLowerCase()]
      if (url) {
        images.push(url)
      } else {
        console.warn(`  ⚠️  Sin imagen para key "${key}" en producto "${product.name}"`)
        warnings++
      }
    }

    // Verificar si ya existe
    const exists = await prisma.product.findUnique({ where: { slug: product.slug } })
    if (exists) {
      console.log(`  ⏭  Ya existe: ${product.name}`)
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        description: product.description || null,
        images,
        tag: product.tag || 'NONE',
        active: true,
        featured: false,
        variants: {
          create: product.variants.map(v => ({
            size: v.size,
            price: v.price,
            stock: 5,
          })),
        },
      },
    })

    console.log(`  ✅ Creado: ${product.name} (${images.length} imágenes, ${product.variants.length} talles)`)
    created++
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Creados: ${created}`)
  console.log(`⏭  Ya existían: ${skipped}`)
  if (warnings > 0) console.log(`⚠️  Advertencias de imágenes faltantes: ${warnings}`)
  console.log(`\n💡 Para ajustar precios/stock editar las variantes en el admin.`)
}

main()
  .catch(err => {
    console.error('Error fatal:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
