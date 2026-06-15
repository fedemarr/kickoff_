'use client'
import { useEffect, useState } from 'react'

interface TopBarProps {
  text?: string
}

export function TopBar({ text }: TopBarProps) {
  const [config, setConfig] = useState<{ bannerText: string } | null>(null)

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => setConfig(d))
      .catch(() => {})
  }, [])

  const bannerText = text ?? config?.bannerText ?? '3 cuotas sin interés · 10% OFF con transferencia'

  return (
    <div className="bg-primary text-white text-sm py-2 px-4 text-center font-medium">
      {bannerText}
    </div>
  )
}
