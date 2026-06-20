"use client"

import React, { useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface VideoHeroProps {
  src: string
  poster?: string
}

export function VideoHero({ src, poster }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
