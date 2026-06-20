"use client"

import { useEffect, useRef } from 'react'

// Each video plays/pauses independently based on viewport visibility.
// "No two playing when not in view" is enforced by pausing on scroll-out,
// not by a global singleton — videos that are simultaneously visible can all play.

export function useVideoInView(threshold = 0.3) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
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
