import { MercadoPagoConfig, Preference } from 'mercadopago'
import type { CartItem } from '@/types'

const PRODUCTION_URL = 'https://kickofftienda.com'

function getMPClient() {
  const token = (process.env.MP_ACCESS_TOKEN || '').replace(/﻿/g, '').trim()
  return new MercadoPagoConfig({ accessToken: token })
}

function getAppUrl() {
  const env = process.env.NEXT_PUBLIC_APP_URL || ''
  if (env && env.startsWith('https://') && !env.includes('localhost')) return env
  return PRODUCTION_URL
}

const isSandbox = process.env.NEXT_PUBLIC_MP_SANDBOX === 'true'

interface CreatePreferenceParams {
  orderId: string
  orderNumber: string
  items: CartItem[]
  payer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    zipCode: string
  }
  installments: number
}

export async function createPreference({
  orderId,
  orderNumber,
  items,
  payer,
  installments,
}: CreatePreferenceParams) {
  const appUrl = getAppUrl()
  const preference = new Preference(getMPClient())

  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.variantId,
        title: `${item.productName} - Talle ${item.size}`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS',
      })),
      payer: {
        name: payer.firstName,
        surname: payer.lastName,
        email: payer.email,
        phone: { number: payer.phone },
        address: {
          street_name: payer.street || '',
          zip_code: payer.zipCode || '',
        },
      },
      back_urls: {
        success: `${appUrl}/checkout/success?order=${orderNumber}`,
        failure: `${appUrl}/checkout/failure?order=${orderNumber}`,
        pending: `${appUrl}/checkout/success?order=${orderNumber}`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${appUrl}/api/webhooks/mp`,
      payment_methods: {
        installments,
      },
      statement_descriptor: 'KICKOFF',
    },
  })

  return {
    id: result.id,
    checkoutUrl: isSandbox
      ? (result.sandbox_init_point ?? result.init_point ?? '')
      : (result.init_point ?? ''),
  }
}
