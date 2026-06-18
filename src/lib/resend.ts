import { Resend } from 'resend'
import type { Order } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'noreply@kickoff.tienda'

export async function sendOrderConfirmation(order: Order & { items: Array<{ productName: string; size: string; quantity: number; unitPrice: number }> }) {
  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Tu pedido #${order.orderNumber} fue recibido — KickOff`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E9916; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">KICKOFF</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111;">¡Gracias por tu compra, ${order.firstName}!</h2>
          <p style="color: #4b5563;">Tu pedido <strong>#${order.orderNumber}</strong> fue recibido correctamente.</p>

          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #111;">Resumen del pedido</h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span>${item.productName} × ${item.quantity} (Talle: ${item.size})</span>
                <span style="font-weight: 600;">$${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</span>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; font-weight: 700; font-size: 18px;">
              <span>Total</span>
              <span style="color: #1E9916;">$${order.total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <p style="color: #4b5563;">Te contactaremos pronto para coordinar el envío.</p>
          <p style="color: #4b5563;">Cualquier consulta escribinos a <a href="mailto:kickoff@tienda.com" style="color: #1E9916;">kickoff@tienda.com</a></p>
        </div>
        <div style="background: #111; padding: 16px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">© 2025 KickOff. Todos los derechos reservados.</p>
        </div>
      </div>
    `,
  })
}

export async function sendTransferDetails(order: Order, bankDetails: { cbu: string; alias: string; bankHolder: string }) {
  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Datos para completar tu pago — Pedido #${order.orderNumber}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E9916; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">KICKOFF</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111;">Datos para tu transferencia</h2>
          <p>Para completar tu pedido <strong>#${order.orderNumber}</strong>, realizá la transferencia por <strong style="color: #1E9916;">$${order.total.toLocaleString('es-AR')}</strong> a:</p>

          <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <div style="margin-bottom: 12px;"><strong>CBU:</strong> ${bankDetails.cbu}</div>
            <div style="margin-bottom: 12px;"><strong>Alias:</strong> ${bankDetails.alias}</div>
            <div style="margin-bottom: 12px;"><strong>Titular:</strong> ${bankDetails.bankHolder}</div>
            <div><strong>Referencia:</strong> Pedido #${order.orderNumber}</div>
          </div>

          <p style="color: #4b5563; font-size: 14px;">Una vez realizada la transferencia, envianos el comprobante a <a href="mailto:kickoff@tienda.com" style="color: #1E9916;">kickoff@tienda.com</a> o por WhatsApp para confirmar tu pedido.</p>
        </div>
      </div>
    `,
  })
}

export async function sendShippingNotification(order: Order) {
  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Tu pedido #${order.orderNumber} fue enviado — KickOff`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E9916; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">KICKOFF</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #111;">¡Tu pedido está en camino!</h2>
          <p>Tu pedido <strong>#${order.orderNumber}</strong> fue despachado.</p>
          ${order.shippingCompany ? `<p><strong>Empresa:</strong> ${order.shippingCompany}</p>` : ''}
          ${order.trackingCode ? `<p><strong>Código de seguimiento:</strong> ${order.trackingCode}</p>` : ''}
        </div>
      </div>
    `,
  })
}
