"use client"

import { useState, useEffect } from 'react'

export function PageLoader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.classList.add('loader-active')

    let minDone = false
    let loadDone = false

    function tryFade() {
      if (!minDone || !loadDone) return
      document.body.classList.remove('loader-active')
      setFading(true)
      setTimeout(() => setGone(true), 550)
    }

    // Minimum display time — gives assets time to buffer
    const minTimer = setTimeout(() => {
      minDone = true
      tryFade()
    }, 2500)

    // Wait for window.load (all resources including preload="auto" videos)
    function onLoad() {
      loadDone = true
      tryFade()
    }

    if (document.readyState === 'complete') {
      loadDone = true
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    // Hard cap — don't hang forever if something refuses to load
    const failsafe = setTimeout(() => {
      minDone = true
      loadDone = true
      tryFade()
    }, 6000)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(failsafe)
      window.removeEventListener('load', onLoad)
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
          style={{ animation: 'loaderBar 2.4s ease-out forwards' }}
        />
      </div>
    </div>
  )
}
