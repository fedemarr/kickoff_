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

          {/* Contenido centrado */}
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
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-white text-lg font-bold tracking-wide italic">
                El rugby en tu piel
              </span>
              <span className="text-white/35 text-[10px] tracking-[0.4em] uppercase font-light">
                Camisetas de Rugby
              </span>
            </motion.div>

            {/* Botón entrar */}
            <motion.button
              onClick={dismiss}
              className="mt-2 px-10 py-3 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest uppercase rounded-full text-sm transition-colors shadow-lg shadow-primary/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Entrar a la tienda
            </motion.button>
          </div>

          {/* Saltar (esquina) */}
          <motion.button
            onClick={dismiss}
            className="absolute bottom-8 right-6 text-white/30 hover:text-white/70 text-xs tracking-widest uppercase transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Saltar →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
