'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const VIDEO_URL = '/intro.mp4'

export function SplashScreen() {
  const [show, setShow] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('ko_splash')) return
    setShow(true)
  }, [])

  useEffect(() => {
    if (!show) return
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [show])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('ko_splash', '1')
  }

  if (!show) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 10 }}>
        <Image src="/logo.jpg" alt="KickOff" width={180} height={180} style={{ borderRadius: '50%' }} priority />
        <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontStyle: 'italic', letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          El rugby en tu piel
        </span>
      </div>

      <button
        onClick={dismiss}
        style={{ position: 'absolute', bottom: 32, right: 24, color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', zIndex: 10, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Saltar →
      </button>
    </div>
  )
}
