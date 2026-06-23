'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function SplashScreen() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('ko_splash')) return
    setShow(true)
  }, [])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('ko_splash', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#050505' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Glow verde de fondo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 420,
              height: 420,
              background: 'radial-gradient(circle, rgba(30,153,22,0.18) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />

          {/* Logo + tagline + barra */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.15, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.85, ease: [0.34, 1.4, 0.64, 1] }}
              style={{ filter: 'drop-shadow(0 0 36px rgba(30,153,22,0.65))' }}
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
              className="text-white/40 text-[11px] tracking-[0.45em] uppercase font-light"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Camisetas de Rugby
            </motion.span>

            {/* Barra de carga */}
            <motion.div
              className="w-40 h-[3px] bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#1E9916' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.1, duration: 2.2, ease: 'easeInOut' }}
                onAnimationComplete={dismiss}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
