export type Role = 'ADMIN' | 'SUPERADMIN'
export type Category = 'SELECCIONES' | 'CLUBES' | 'EQUIPAMIENTO'
export type Tag = 'NONE' | 'NEW' | 'SALE' | 'FEATURED'
export type PaymentMethod = 'MERCADOPAGO' | 'TRANSFER' | 'CASH'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type EncargoStatus = 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'ORDERED' | 'ARRIVED' | 'DELIVERED' | 'CANCELLED'

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color?: string | null
  price: number
  oldPrice?: number | null
  stock: number
  sku?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  details?: string | null
  returns?: string | null
  sizeChart?: string | null
  brand: string
  category: Category
  images: string[]
  tag: Tag
  active: boolean
  featured: boolean
  variants: ProductVariant[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  slug: string
  image: string
  size: string
  price: number
  quantity: number
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string
  quantity: number
  unitPrice: number
  size: string
  productName: string
}

export interface Order {
  id: string
  orderNumber: string
  dni: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  province: string
  zipCode: string
  country: string
  notes?: string | null
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  couponCode?: string | null
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  mpPaymentId?: string | null
  mpPreferenceId?: string | null
  status: OrderStatus
  shippingCompany?: string | null
  trackingCode?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SiteConfig {
  id: string
  bannerText: string
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  freeShippingFrom: number
  transferDiscount: number
  installments: number
  primaryColor: string
  instagram: string
  tiktok: string
  email: string
  whatsapp: string
  cbu: string
  alias: string
  bankHolder: string
  statClients: string
  statModels: string
  statSelecciones: string
  statYears: string
  shippingDeadlineText: string
  encargoWindowOpen: boolean
  encargoWindow1Start: number
  encargoWindow1End: number
  encargoWindow2Start: number
  encargoWindow2End: number
  encargoWhatsapp: string
  encargoDeliveryTime: string
  encargoLegalText: string
}

export interface EncargoProduct {
  id: string
  name: string
  slug: string
  brand: string
  description?: string | null
  images: string[]
  season?: string | null
  origin?: string | null
  nation?: string | null
  league?: string | null
  active: boolean
}

export interface EncargoData {
  productName: string
  brand: string
  size: string
  name: string
  phone: string
  email?: string
  notes?: string
  ventana: string
}

export type VentanaEncargo = {
  isOpen: boolean
  ventana: '1-15' | '16-30' | null
  diaActual: number
  diasRestantes: number
  proximaApertura: string
  mensajeEstado: string
  closeDate: Date | null
}
