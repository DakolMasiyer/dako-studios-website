"use client"

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'

interface PortraitVideoHeroProps {
  src: string
  poster?: string
}

export function PortraitVideoHero({ src, poster }: PortraitVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  function togglePlay() {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-[8px] border border-border/20 bg-[#0A0908] flex items-center justify-center">
      {/* Blurred background */}
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover blur-[8px] brightness-[0.2] scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Phone frame */}
      <div className="relative z-10 h-[88%] aspect-[9/19.5] rounded-[20px] border-[3px] border-[#3A3A3D] bg-black shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]">
        {/* Camera notch */}
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-8 h-1.5 rounded-full bg-[#3A3A3D] z-10" />
        {/* Video */}
        <div className="relative w-full h-full rounded-[17px] overflow-hidden">
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
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
