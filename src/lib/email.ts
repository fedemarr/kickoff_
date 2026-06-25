import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'KickOff <onboarding@resend.dev>'
const OWNER_EMAIL = 'fedenez11@gmail.com'
const WA_NUMBER = '5491156192976'

interface OrderItem {
  productName: string
  size: string
  quantity: number
  unitPrice: number
}

interface OrderEmailData {
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

// Email al comprador
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola! Acabo de hacer el pedido #${order.orderNumber}`)}`

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `¡Pedido confirmado! #${order.orderNumber} — KickOff`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#111;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">KICK<span style="color:#1e9916">OFF</span></h1>
        </div>

        <div style="padding:32px 24px">
          <h2 style="margin:0 0 8px">¡Gracias por tu compra, ${order.firstName}!</h2>
          <p style="color:#555;margin:0 0 24px">Tu pedido fue recibido correctamente.</p>

          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0 0 4px;font-size:13px;color:#888">NÚMERO DE PEDIDO</p>
            <p style="margin:0;font-size:22px;font-weight:bold;color:#1e9916">#${order.orderNumber}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="background:#f0f0f0">
                <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase">Producto</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase">Cant.</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase">Total</th>
              </tr>
            </thead>
            <tbody>${itemsTable(order.items)}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;font-weight:bold;text-align:right">TOTAL</td>
                <td style="padding:12px;font-weight:bold;text-align:right;color:#1e9916">${formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-weight:bold">Datos de envío</p>
            <p style="margin:0;color:#555;font-size:14px">${order.firstName} ${order.lastName}<br>${order.street}, ${order.city}, ${order.province}<br>${order.phone}</p>
          </div>

          <div style="text-align:center;background:#25D366;border-radius:8px;padding:16px">
            <p style="margin:0 0 12px;color:#fff;font-weight:bold">¡Coordiná el envío por WhatsApp!</p>
            <a href="${waLink}" style="background:#fff;color:#25D366;padding:12px 28px;border-radius:999px;font-weight:bold;text-decoration:none;font-size:14px">
              Escribinos →
            </a>
          </div>
        </div>

        <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">
          © ${new Date().getFullYear()} KickOff · Powered by FMCode
        </div>
      </div>
    `,
  })
}

// Email al dueño
export async function sendNewOrderNotification(order: OrderEmailData) {
  await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `🛒 Nuevo pedido #${order.orderNumber} — ${formatPrice(order.total)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#111;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">KICK<span style="color:#1e9916">OFF</span> — Nuevo pedido</h1>
        </div>

        <div style="padding:24px">
          <h2 style="margin:0 0 4px">Pedido #${order.orderNumber}</h2>
          <p style="color:#1e9916;font-size:22px;font-weight:bold;margin:0 0 20px">${formatPrice(order.total)}</p>

          <p style="margin:0 0 4px"><strong>Cliente:</strong> ${order.firstName} ${order.lastName}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${order.email}</p>
          <p style="margin:0 0 4px"><strong>Teléfono:</strong> ${order.phone}</p>
          <p style="margin:0 0 4px"><strong>Dirección:</strong> ${order.street}, ${order.city}, ${order.province}</p>
          <p style="margin:0 0 20px"><strong>Pago:</strong> ${order.paymentMethod}</p>

          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f0f0f0">
                <th style="padding:8px;text-align:left">Producto</th>
                <th style="padding:8px;text-align:center">Cant.</th>
                <th style="padding:8px;text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>${itemsTable(order.items)}</tbody>
          </table>

          <p style="margin:20px 0 0;text-align:center">
            <a href="https://wa.me/${order.phone}" style="background:#25D366;color:#fff;padding:10px 24px;border-radius:999px;font-weight:bold;text-decoration:none;font-size:13px">
              Contactar cliente por WhatsApp
            </a>
          </p>
        </div>
      </div>
    `,
  })
}
