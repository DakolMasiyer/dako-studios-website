"use client"

import { useState, useRef } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'

interface CyclingVideoPlayerProps {
  videos: string[]
  poster?: string
}

export function CyclingVideoPlayer({ videos, poster }: CyclingVideoPlayerProps) {
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  function advance() {
    setCurrent((i) => (i + 1) % videos.length)
  }

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
    <div className="relative w-full aspect-video overflow-hidden rounded-[8px] border border-border/20 bg-[#0A0908] group">
      <video
        key={current}
        ref={videoRef}
        src={videos[current]}
        poster={current === 0 ? poster : undefined}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={advance}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
