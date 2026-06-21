"use client"

import { useState, useEffect } from 'react'

export function PageLoader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.classList.add('loader-active')

    // Deterministic, fixed-duration intro — the bar fills smoothly to 100% over
    // ~1.9s and we reveal right after, regardless of how long assets take to load.
    // This keeps the loader feeling intentional instead of sitting full-but-waiting
    // (which read as "stuck") on slow/cold loads. The page reveals on a predictable
    // ~2.5s total; any hero video keeps buffering underneath after the reveal.
    const REVEAL_AT = 2000 // ms — just after the bar finishes its fill

    const revealTimer = setTimeout(() => {
      document.body.classList.remove('loader-active')
      setFading(true)
      setTimeout(() => setGone(true), 550)
    }, REVEAL_AT)

    return () => {
      clearTimeout(revealTimer)
      document.body.classList.remove('loader-active')
    }
  }, [])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <svg
        width="52"
        height="51"
        viewBox="0 0 205 200"
        fill="none"
        className="text-primary"
        style={{ animation: 'loaderPulse 1.2s ease-in-out' }}
      >
        <path
          d="M 0 0 L 108 0 Q 205 0 205 100 Q 205 200 108 200 L 0 200 L 0 132 L 70 100 L 0 68 Z"
          fill="currentColor"
        />
      </svg>

      <div className="mt-5 text-[10px] font-bold tracking-[0.28em] text-muted-foreground uppercase select-none">
        Dako Studios
      </div>

      <div className="mt-8 w-36 h-[2px] bg-border/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ animation: 'loaderBar 1.9s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
        />
      </div>
    </div>
  )
}
