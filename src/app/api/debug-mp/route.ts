import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const APP_URL = 'https://kickoff-ten.vercel.app'

export async function GET() {
  const rawToken = process.env.MP_ACCESS_TOKEN || ''
  const token = rawToken.replace(/﻿/g, '').trim()
  const appUrlEnv = process.env.NEXT_PUBLIC_APP_URL || ''

  try {
    const client = new MercadoPagoConfig({ accessToken: token })
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [{ id: 'test', title: 'Test Item', quantity: 1, unit_price: 100, currency_id: 'ARS' }],
        back_urls: {
          success: `${APP_URL}/checkout/success`,
          failure: `${APP_URL}/checkout/failure`,
          pending: `${APP_URL}/checkout/success`,
        },
        external_reference: 'debug-test',
      },
    })

    return NextResponse.json({
      ok: true,
      preferenceId: result.id,
      sandbox_url: result.sandbox_init_point,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      appUrlEnv,
      hasBom: rawToken.charCodeAt(0) === 65279,
    })
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message,
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      appUrlEnv,
      hasBom: rawToken.charCodeAt(0) === 65279,
    }, { status: 500 })
  }
}
