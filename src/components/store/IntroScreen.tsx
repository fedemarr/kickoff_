'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Versión 1080p para no cargar 68MB del original 4K
const VIDEO_URL =
  'https://res.cloudinary.com/dspthapnw/video/upload/q_auto,w_1920/kickoff/intro/introkickoff.mp4'

export function IntroScreen() {
  const [mounted, setMounted]         = useState(false)
  const [fading, setFading]           = useState(false)
  const [logoVisible, setLogoVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('ko-intro-seen')) return
    setMounted(true)

    // Logo aparece 0.8s después de que arranca el video
    const t = setTimeout(() => setLogoVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setFading(true)
    sessionStorage.setItem('ko-intro-seen', '1')
    setTimeout(() => setMounted(false), 700)
  }

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.7s ease' }}
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Gradiente oscuro para que el logo resalte */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Logo centrado con animación de aparición */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div
          style={{
            opacity:   logoVisible ? 1 : 0,
            transform: logoVisible ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <Image
            src="/logo.jpg"
            alt="KickOff"
            width={200}
            height={200}
            priority
            className="drop-shadow-[0_0_40px_rgba(30,153,22,0.6)] rounded-2xl"
          />
        </div>

        <p
          style={{
            opacity:   logoVisible ? 1 : 0,
            transform: logoVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
          className="text-white text-sm font-bold tracking-[0.3em] uppercase"
        >
          Camisetas de Rugby
        </p>
      </div>

      {/* Botón saltar */}
      <button
        onClick={dismiss}
        className="absolute bottom-8 right-6 text-white/60 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors border border-white/20 hover:border-white/50 px-4 py-2 rounded-full"
      >
        Saltar →
      </button>
    </div>
  )
}
