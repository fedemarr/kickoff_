import type { VentanaEncargo } from '@/types'

interface EncargoConfig {
  window1Start?: number
  window1End?: number
  window2Start?: number
  window2End?: number
  overrideOpen?: boolean | null
}

export function getVentanaEncargo(config?: EncargoConfig): VentanaEncargo {
  const hoy = new Date()
  const dia = hoy.getDate()
  const mes = hoy.toLocaleString('es-AR', { month: 'long' })
  const mesNum = hoy.getMonth()
  const year = hoy.getFullYear()

  const w1Start = config?.window1Start ?? 1
  const w1End = config?.window1End ?? 15
  const w2Start = config?.window2Start ?? 16
  const w2End = config?.window2End ?? 31
  const ultimoDia = new Date(year, mesNum + 1, 0).getDate()

  // Manual override
  if (config?.overrideOpen === false) {
    return {
      isOpen: false,
      ventana: null,
      diaActual: dia,
      diasRestantes: 0,
      proximaApertura: `el 1 del mes que viene`,
      mensajeEstado: 'Encargos cerrados por el momento',
      closeDate: null,
    }
  }

  if (dia >= w1Start && dia <= w1End) {
    const closeDate = new Date(year, mesNum, w1End)
    return {
      isOpen: true,
      ventana: '1-15',
      diaActual: dia,
      diasRestantes: w1End - dia,
      proximaApertura: `el ${w2Start} de ${mes}`,
      mensajeEstado: `¡Encargos abiertos! Cerramos el ${w1End} de ${mes}`,
      closeDate,
    }
  }

  const effectiveW2End = Math.min(w2End, ultimoDia)
  if (dia >= w2Start && dia <= effectiveW2End) {
    const closeDate = new Date(year, mesNum, effectiveW2End)
    return {
      isOpen: true,
      ventana: '16-30',
      diaActual: dia,
      diasRestantes: effectiveW2End - dia,
      proximaApertura: `el 1 del mes que viene`,
      mensajeEstado: `¡Encargos abiertos! Cerramos el ${effectiveW2End} de ${mes}`,
      closeDate,
    }
  }

  return {
    isOpen: false,
    ventana: null,
    diaActual: dia,
    diasRestantes: 0,
    proximaApertura: `el 1 del mes que viene`,
    mensajeEstado: 'Encargos cerrados por el momento',
    closeDate: null,
  }
}

export function getVentanaLabel(ventana: VentanaEncargo): string {
  const now = new Date()
  const mes = now.toLocaleString('es-AR', { month: 'long' })
  const year = now.getFullYear()
  if (!ventana.isOpen) return `cerrado`
  if (ventana.ventana === '1-15') return `1 al 15 de ${mes} ${year}`
  return `16 al ${new Date(year, now.getMonth() + 1, 0).getDate()} de ${mes} ${year}`
}
