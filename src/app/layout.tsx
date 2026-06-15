import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'KickOff — Camisetas oficiales de rugby', template: '%s | KickOff' },
  description: 'Camisetas oficiales de selecciones nacionales y clubes de rugby. Selecciones, clubes y equipamiento. Envío a todo Argentina.',
  keywords: ['camisetas rugby', 'rugby argentina', 'pumas', 'all blacks', 'springboks', 'equipamiento rugby'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'KickOff',
    title: 'KickOff — Camisetas oficiales de rugby',
    description: 'La tienda de rugby más completa de Argentina.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
