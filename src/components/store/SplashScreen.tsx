'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const VIDEO_URL =
  'https://res.cloudinary.com/dspthapnw/video/upload/q_auto,w_1920/kickoff/intro/introkickoff.mp4'

export function SplashScreen() {
  const [show, setShow]               = useState(false)
  const [logoVisible, setLogoVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('ko_splash')) return
    setShow(true)
    // Logo aparece 0.8s después de que empieza el video
    const t = setTimeout(() => setLogoVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('ko_splash', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* ── Video de fondo ── */}
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

          {/* Overlay oscuro para que el logo resalte */}
          <div className="absolute inset-0 bg-black/40" />

          {/* ── Logo + tagline centrados ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <AnimatePresence>
              {logoVisible && (
                <>
                  {/* Glow verde detrás del logo */}
                  <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: 340,
                      height: 340,
                      background: 'radial-gradient(circle, rgba(30,153,22,0.35) 0%, transparent 70%)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9 }}
                  />

                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0.15, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.85, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ filter: 'drop-shadow(0 0 36px rgba(30,153,22,0.7))' }}
                  >
                    <Image
                      src="/logo.jpg"
                      alt="KickOff"
                      width={190}
                      height={190}
                      className="rounded-full"
                      priority
                    />
                  </motion.div>

                  {/* Tagline */}
                  <motion.span
                    className="text-white/70 text-[11px] tracking-[0.45em] uppercase font-light"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Camisetas de Rugby
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ── Botón saltar ── */}
          <motion.button
            onClick={dismiss}
            className="absolute bottom-8 right-6 text-white/50 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors border border-white/20 hover:border-white/50 px-4 py-2 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Saltar →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
