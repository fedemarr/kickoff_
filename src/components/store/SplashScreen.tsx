'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const BALLS = [
  { id: 1, tx: -130, ty: -85,  delay: 0.45, rot: 720,  size: 38 },
  { id: 2, tx: 125,  ty: -80,  delay: 0.55, rot: -540, size: 34 },
  { id: 3, tx: -105, ty: 105,  delay: 0.65, rot: 360,  size: 30 },
  { id: 4, tx: 115,  ty: 95,   delay: 0.50, rot: -720, size: 36 },
  { id: 5, tx: -50,  ty: -145, delay: 0.70, rot: 540,  size: 28 },
  { id: 6, tx: 60,   ty: 140,  delay: 0.42, rot: -360, size: 32 },
]

function GoalPosts() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="postGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E9916" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1E9916" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Left upright */}
      <rect x="88" y="0" width="11" height="900" fill="url(#postGrad)" rx="5" filter="url(#glow)" />
      {/* Right upright */}
      <rect x="500" y="0" width="11" height="900" fill="url(#postGrad)" rx="5" filter="url(#glow)" />
      {/* Crossbar */}
      <rect x="82" y="310" width="434" height="11" fill="#1E9916" opacity="0.45" rx="5" filter="url(#glow)" />

      {/* Extra glow line on crossbar */}
      <rect x="82" y="308" width="434" height="15" fill="#1E9916" opacity="0.12" rx="7" />

      {/* Field lines faint */}
      <line x1="0" y1="860" x2="600" y2="860" stroke="#1E9916" strokeWidth="1.5" opacity="0.15" />
      <line x1="0" y1="880" x2="600" y2="880" stroke="#1E9916" strokeWidth="1" opacity="0.08" />
    </svg>
  )
}

export function SplashScreen() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('ko_splash')) return
    setShow(true)
    const t = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('ko_splash', '1')
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#050505' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {/* H-posts */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <GoalPosts />
          </motion.div>

          {/* Radial green glow behind logo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 360,
              height: 360,
              background: 'radial-gradient(circle, rgba(30,153,22,0.22) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          />

          {/* Rugby balls */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {BALLS.map((b) => (
              <motion.span
                key={b.id}
                className="absolute select-none"
                style={{ fontSize: b.size, lineHeight: 1 }}
                initial={{ x: b.tx * 4, y: b.ty * 4, opacity: 0, scale: 0, rotate: 0 }}
                animate={{ x: b.tx, y: b.ty, opacity: 0.85, scale: 1, rotate: b.rot }}
                transition={{ delay: b.delay, duration: 0.75, ease: [0.34, 1.2, 0.64, 1] }}
              >
                🏉
              </motion.span>
            ))}
          </div>

          {/* Logo + tagline */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.15, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.85, ease: [0.34, 1.4, 0.64, 1] }}
              style={{ filter: 'drop-shadow(0 0 32px rgba(30,153,22,0.65))' }}
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

            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
            >
              <span className="text-white/30 text-[11px] tracking-[0.45em] uppercase font-light">
                Rugby Shirts
              </span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#1E9916' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 2.4, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
