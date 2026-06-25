'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const VIDEO_URL = '/intro.mp4'

export function SplashScreen() {
  const [show, setShow] = useState(false)
  const [videoBlocked, setVideoBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('ko_splash')) return
    setShow(true)
  }, [])

  useEffect(() => {
    if (!show) return
    const v = videoRef.current
    if (!v) return

    const tryPlay = () => {
      v.play().then(() => setVideoBlocked(false)).catch(() => setVideoBlocked(true))
    }

    v.load()
    tryPlay()
    v.addEventListener('loadeddata', tryPlay)
    v.addEventListener('canplay', tryPlay)

    return () => {
      v.removeEventListener('loadeddata', tryPlay)
      v.removeEventListener('canplay', tryPlay)
    }
  }, [show])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('ko_splash', '1')
  }

  const handleTap = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setVideoBlocked(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black" onClick={handleTap}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 gap-5">
        <Image
          src="/logo.jpg"
          alt="KickOff"
          width={160}
          height={160}
          className="rounded-full w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover"
          priority
        />
        <span className="text-white text-base sm:text-lg md:text-xl font-bold italic tracking-wide drop-shadow-lg text-center">
          El rugby en tu piel
        </span>

        {videoBlocked && (
          <p className="text-white/70 text-sm animate-pulse">
            Tocá para reproducir el video
          </p>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          className="mt-1 w-full max-w-xs sm:w-auto px-10 py-4 sm:py-3 bg-primary text-white font-bold text-sm tracking-widest uppercase rounded-full border-none cursor-pointer active:scale-95 transition-transform"
        >
          Entrar a la tienda
        </button>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); dismiss() }}
        className="absolute bottom-8 right-5 z-10 text-white/50 text-xs tracking-widest uppercase py-3 px-4"
      >
        Saltar →
      </button>
    </div>
  )
}
