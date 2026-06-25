import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function GET() {
  try {
    const rawToken = process.env.MP_ACCESS_TOKEN || ''
    const token = rawToken.replace(/^﻿/, '').trim()

    const tokenInfo = {
      length: rawToken.length,
      cleanLength: token.length,
      firstChar: rawToken.charCodeAt(0),
      preview: token.substring(0, 20) + '...',
      hasBom: rawToken.charCodeAt(0) === 65279,
    }

    const client = new MercadoPagoConfig({ accessToken: token })
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [{ id: 'test', title: 'Test Item', quantity: 1, unit_price: 100, currency_id: 'ARS' }],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        },
        external_reference: 'debug-test',
      },
    })

    return NextResponse.json({
      ok: true,
      tokenInfo,
      preferenceId: result.id,
      sandbox_url: result.sandbox_init_point,
      app_url: process.env.NEXT_PUBLIC_APP_URL,
      sandbox_mode: process.env.NEXT_PUBLIC_MP_SANDBOX,
    })
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message,
      cause: error?.cause,
      status: error?.status,
      stack: error?.stack?.split('\n').slice(0, 3),
    }, { status: 500 })
  }
}
