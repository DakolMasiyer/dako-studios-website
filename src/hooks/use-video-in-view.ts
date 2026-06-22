"use client"

import { useEffect, useRef } from 'react'

export function shouldAutoPlayVideo(): boolean {
  if (typeof window === 'undefined') return true
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // @ts-ignore - navigator.connection is not standard on all browsers yet
  const conn = navigator.connection as
    | { saveData?: boolean; effectiveType?: string }
    | undefined
  // Skip autoplay when the user opted into data-saver OR is on a 2G-class connection.
  const slowConnection =
    !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ''))
  return !prefersReducedMotion && !slowConnection
}

// Each video plays/pauses independently based on viewport visibility.
// "No two playing when not in view" is enforced by pausing on scroll-out,
// not by a global singleton — videos that are simultaneously visible can all play.

export function useVideoInView(threshold = 0.3) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // React doesn't reliably set the `muted` DOM *property* from the JSX
    // attribute — without this the browser sees an unmuted video and blocks
    // autoplay, forcing a manual Play press. Set it imperatively.
    video.defaultMuted = true
    video.muted = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else if (!video.paused) {
          video.pause()
        }
      },
      { threshold }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [threshold])

  return ref
}

// For manual controls in VideoCard / PortraitPhoneCard
export function requestPlay(video: HTMLVideoElement) {
  return video.play().catch(() => {})
}

export function requestPause(video: HTMLVideoElement) {
  video.pause()
}
