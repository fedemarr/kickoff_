import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const key = (process.env.RESEND_API_KEY || '').replace(/﻿/g, '').trim()
  const resend = new Resend(key)

  try {
    const result = await resend.emails.send({
      from: 'KickOff <onboarding@resend.dev>',
      to: 'tiendakickoff@gmail.com',
      subject: 'Test email KickOff',
      html: '<p>Si recibís esto, Resend funciona correctamente.</p>',
    })

    return NextResponse.json({
      ok: true,
      id: result.data?.id,
      error: result.error,
      keyLength: key.length,
      keyPreview: key.substring(0, 10) + '...',
    })
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message,
      statusCode: err?.statusCode,
      keyLength: key.length,
      keyPreview: key.substring(0, 10) + '...',
    }, { status: 500 })
  }
}
