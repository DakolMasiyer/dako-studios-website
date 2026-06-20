"use client"

import { useState, useEffect } from 'react'

export function PageLoader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.classList.add('loader-active')

    let minDone = false
    let loadDone = false
    let videoDone = false

    function tryFade() {
      if (!minDone || !loadDone || !videoDone) return
      document.body.classList.remove('loader-active')
      setFading(true)
      setTimeout(() => setGone(true), 550)
    }

    // Minimum display time — avoids a jarring flash on fast loads
    const minTimer = setTimeout(() => {
      minDone = true
      tryFade()
    }, 1500)

    // Wait for window.load (scripts, styles, images)
    function onLoad() {
      loadDone = true
      tryFade()
    }

    if (document.readyState === 'complete') {
      loadDone = true
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    // Wait for the first video to be playable, so the page reveals with the
    // first reel already buffered instead of a static/loading flash.
    // window.load does NOT wait for video media data, so gate on it explicitly.
    const firstVideo = document.querySelector('video')
    function onVideoReady() {
      videoDone = true
      tryFade()
    }
    if (!firstVideo) {
      videoDone = true
    } else if (firstVideo.readyState >= 3 /* HAVE_FUTURE_DATA */) {
      videoDone = true
    } else {
      firstVideo.addEventListener('canplay', onVideoReady, { once: true })
      firstVideo.addEventListener('loadeddata', onVideoReady, { once: true })
      // If the video errors (e.g. network failure), don't stall the reveal
      firstVideo.addEventListener('error', onVideoReady, { once: true })
    }

    // Hard cap — force-reveal even if assets are still loading (slow networks)
    const failsafe = setTimeout(() => {
      minDone = true
      loadDone = true
      videoDone = true
      tryFade()
    }, 8000)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(failsafe)
      window.removeEventListener('load', onLoad)
      firstVideo?.removeEventListener('canplay', onVideoReady)
      firstVideo?.removeEventListener('loadeddata', onVideoReady)
      firstVideo?.removeEventListener('error', onVideoReady)
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
