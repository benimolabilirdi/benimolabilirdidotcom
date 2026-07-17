'use client'

/**
 * Şok mekanizması (docs/03 §4): 0'dan value'ya ease-out sayar. tabular-nums ile
 * titremez. Format R6: TL sonda, kuruşsuz (formatTL). Şok rakamı için büyük + mercan.
 */
import { useEffect, useRef, useState } from 'react'
import { formatTL } from '@/lib/share-card'

type Props = {
  value: number
  durationMs?: number
  fontSize?: number
  color?: string
  weight?: number
}

export function CountUp({ value, durationMs = 1400, fontSize = 64, color = 'var(--coral-400)', weight = 800 }: Props) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // prefers-reduced-motion: animasyonu atla, doğrudan değeri göster.
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    let start: number | null = null
    const step = (t: number) => {
      if (start === null) start = t
      const p = Math.min((t - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setDisplay(value * eased)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, durationMs])

  return (
    <span
      style={{
        fontFamily: 'var(--font-ui)',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: weight,
        fontSize,
        lineHeight: 1.02,
        letterSpacing: '-0.03em',
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {formatTL(display)}
    </span>
  )
}
