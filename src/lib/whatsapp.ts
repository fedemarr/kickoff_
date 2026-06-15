import type { EncargoData } from '@/types'

export function buildWhatsAppMessage(encargo: EncargoData): string {
  const msg = `
🏉 *NUEVO ENCARGO — KickOff*

📦 *Producto:* ${encargo.productName}
🏷️ *Marca:* ${encargo.brand}
📐 *Talle:* ${encargo.size}
${encargo.notes ? `📝 *Aclaración:* ${encargo.notes}` : ''}

👤 *Cliente:* ${encargo.name}
📱 *WhatsApp:* ${encargo.phone}
${encargo.email ? `📧 *Email:* ${encargo.email}` : ''}

📅 *Fecha del encargo:* ${new Date().toLocaleDateString('es-AR')}
🕐 *Ventana:* ${encargo.ventana}
  `.trim()

  return encodeURIComponent(msg)
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${message}`
}
