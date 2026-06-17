import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const result: Record<string, unknown> = {
    dbUrl: process.env.DATABASE_URL ? 'SET (' + process.env.DATABASE_URL.split('@')[1]?.split('/')[0] + ')' : 'NOT SET',
    nextauthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@kickoff.tienda' },
      select: { id: true, email: true, role: true, password: true },
    })

    if (!user) {
      result.user = 'NOT FOUND'
    } else {
      const valid = await bcrypt.compare('kickoff2025', user.password)
      result.user = { found: true, role: user.role, passwordValid: valid }
    }
  } catch (err: unknown) {
    result.dbError = err instanceof Error ? err.message : String(err)
  }

  return NextResponse.json(result)
}
