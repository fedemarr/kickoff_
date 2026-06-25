import { MercadoPagoConfig, Preference } from 'mercadopago'
import type { CartItem } from '@/types'

function getMPClient() {
  return new MercadoPagoConfig({
    accessToken: (process.env.MP_ACCESS_TOKEN || '').replace(/^﻿/, ''),
  })
}

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
          street_name: payer.street,
          zip_code: payer.zipCode,
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure?order=${orderNumber}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${orderNumber}`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mp`,
      payment_methods: {
        installments,
      },
      statement_descriptor: 'KICKOFF',
    },
  })

  return result
}
