import { Resend } from 'resend'

function getResend() {
  const key = (process.env.RESEND_API_KEY || '').replace(/﻿/g, '').trim()
  return new Resend(key)
}

const FROM = 'KickOff <onboarding@resend.dev>'
const OWNER_EMAIL = 'tiendakickoff@gmail.com'
const WA_NUMBER = '5491156192976'

interface OrderItem {
  productName: string
  size: string
  quantity: number
  unitPrice: number
}

interface BankDetails {
  cbu?: string
  alias?: string
  bankHolder?: string
}

export interface OrderEmailData {
  orderNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  province: string
  total: number
  paymentMethod: string
  items: OrderItem[]
  bankDetails?: BankDetails
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function itemsTable(items: OrderItem[]) {
  return items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.productName} — Talle ${i.size}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPrice(i.unitPrice * i.quantity)}</td>
    </tr>`
  ).join('')
}

function waButton(number: string, message: string, label: string) {
  const link = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return `
    <div style="text-align:center;background:#25D366;border-radius:8px;padding:16px;margin:24px 0">
      <p style="margin:0 0 12px;color:#fff;font-weight:bold;font-size:15px">¡Coordiná el envío por WhatsApp!</p>
      <a href="${link}" style="background:#fff;color:#25D366;padding:12px 28px;border-radius:999px;font-weight:bold;text-decoration:none;font-size:14px">
        ${label}
      </a>
    </div>`
}

function transferBlock(bank: BankDetails, orderNumber: string) {
  if (!bank.cbu && !bank.alias) return ''
  return `
    <div style="background:#fff9e6;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:24px 0">
      <p style="margin:0 0 10px;font-weight:bold;color:#92400e">💳 Datos para la transferencia</p>
      ${bank.cbu ? `<p style="margin:0 0 4px;font-size:14px"><strong>CBU:</strong> ${bank.cbu}</p>` : ''}
      ${bank.alias ? `<p style="margin:0 0 4px;font-size:14px"><strong>Alias:</strong> ${bank.alias}</p>` : ''}
      ${bank.bankHolder ? `<p style="margin:0 0 4px;font-size:14px"><strong>Titular:</strong> ${bank.bankHolder}</p>` : ''}
      <p style="margin:8px 0 0;font-size:13px;color:#92400e;font-weight:bold">
        Referencia de pago: Pedido #${orderNumber}
      </p>
    </div>`
}

// ── Email al comprador ────────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const isTransfer = order.paymentMethod === 'TRANSFER'
  const isMp = order.paymentMethod === 'MERCADOPAGO'

  const waMsg = `Hola! Acabo de hacer el pedido #${order.orderNumber} en KickOff. Quiero coordinar el envío.`

  const paymentBadge = isMp
    ? `<span style="background:#009ee3;color:#fff;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:bold">MercadoPago ✓</span>`
    : isTransfer
    ? `<span style="background:#fcd34d;color:#92400e;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:bold">Transferencia bancaria</span>`
    : `<span style="background:#e5e7eb;color:#374151;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:bold">Efectivo</span>`

  await getResend().emails.send({
    from: FROM,
    to: order.email,
    subject: `¡Pedido confirmado! #${order.orderNumber} — KickOff`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#111;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">KICK<span style="color:#1e9916">OFF</span></h1>
          <p style="color:#aaa;margin:4px 0 0;font-size:13px">Camisetas de Rugby</p>
        </div>

        <div style="padding:32px 24px">
          <h2 style="margin:0 0 4px">¡Gracias por tu compra, ${order.firstName}!</h2>
          <p style="color:#555;margin:0 0 20px">Tu pedido fue recibido. Aquí está el resumen:</p>

          <div style="display:flex;gap:12px;align-items:center;margin-bottom:24px">
            <div style="background:#f9f9f9;border-radius:8px;padding:16px;flex:1">
              <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase">Número de pedido</p>
              <p style="margin:0;font-size:24px;font-weight:bold;color:#1e9916">#${order.orderNumber}</p>
            </div>
            <div style="background:#f9f9f9;border-radius:8px;padding:16px;flex:1">
              <p style="margin:0 0 4px;font-size:12px;color:#888;text-transform:uppercase">Método de pago</p>
              <p style="margin:0">${paymentBadge}</p>
            </div>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
            <thead>
              <tr style="background:#f0f0f0">
                <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase">Producto</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase">Cant.</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Total</th>
              </tr>
            </thead>
            <tbody>${itemsTable(order.items)}</tbody>
            <tfoot>
              <tr style="background:#f9f9f9">
                <td colspan="2" style="padding:12px;font-weight:bold;text-align:right">TOTAL</td>
                <td style="padding:12px;font-weight:bold;text-align:right;color:#1e9916;font-size:18px">${formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:24px 0">
            <p style="margin:0 0 8px;font-weight:bold;font-size:13px;text-transform:uppercase;color:#555">Datos de envío</p>
            <p style="margin:0;color:#333;font-size:14px;line-height:1.6">
              ${order.firstName} ${order.lastName}<br>
              ${order.street}, ${order.city}, ${order.province}<br>
              Tel: ${order.phone}
            </p>
          </div>

          ${isTransfer && order.bankDetails ? transferBlock(order.bankDetails, order.orderNumber) : ''}

          ${waButton(WA_NUMBER, waMsg, 'Coordinar envío →')}
        </div>

        <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">
          © ${new Date().getFullYear()} KickOff · Powered by FMCode
        </div>
      </div>
    `,
  })
}

// ── Email al dueño ────────────────────────────────────────────────────────────
export async function sendNewOrderNotification(order: OrderEmailData) {
  const clientWa = `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.firstName}! Te escribo de KickOff por tu pedido #${order.orderNumber}.`)}`

  const paymentLabel = order.paymentMethod === 'MERCADOPAGO' ? 'MercadoPago ✓'
    : order.paymentMethod === 'TRANSFER' ? 'Transferencia bancaria (pendiente)'
    : 'Efectivo'

  await getResend().emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `🛒 Nuevo pedido #${order.orderNumber} — ${formatPrice(order.total)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#111;padding:20px 24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">KICK<span style="color:#1e9916">OFF</span> — Nuevo pedido</h1>
        </div>

        <div style="padding:24px">
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="margin:0 0 4px;font-size:13px;color:#166534">PEDIDO</p>
            <p style="margin:0 0 4px;font-size:26px;font-weight:bold;color:#111">#${order.orderNumber}</p>
            <p style="margin:0;font-size:20px;font-weight:bold;color:#1e9916">${formatPrice(order.total)}</p>
          </div>

          <p style="margin:0 0 4px"><strong>Cliente:</strong> ${order.firstName} ${order.lastName}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${order.email}</p>
          <p style="margin:0 0 4px"><strong>Teléfono:</strong> ${order.phone}</p>
          <p style="margin:0 0 4px"><strong>Dirección:</strong> ${order.street}, ${order.city}, ${order.province}</p>
          <p style="margin:0 0 20px"><strong>Pago:</strong> ${paymentLabel}</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <thead>
              <tr style="background:#f0f0f0">
                <th style="padding:8px 12px;text-align:left;font-size:12px">Producto</th>
                <th style="padding:8px 12px;text-align:center;font-size:12px">Cant.</th>
                <th style="padding:8px 12px;text-align:right;font-size:12px">Total</th>
              </tr>
            </thead>
            <tbody>${itemsTable(order.items)}</tbody>
          </table>

          <div style="text-align:center">
            <a href="${clientWa}" style="background:#25D366;color:#fff;padding:12px 28px;border-radius:999px;font-weight:bold;text-decoration:none;font-size:14px;display:inline-block">
              📱 Contactar a ${order.firstName} por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `,
  })
}
