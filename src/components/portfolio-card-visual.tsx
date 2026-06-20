"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import { PortfolioItem } from '@/data/portfolio'
import { useVideoInView, requestPlay, requestPause, shouldAutoPlayVideo } from '@/hooks/use-video-in-view'

interface PortfolioCardVisualProps {
  item: PortfolioItem
}

export function PortfolioCardVisual({ item }: PortfolioCardVisualProps) {
  if (item.videos && item.videos.length > 0) {
    return <CyclingCover videos={item.videos} poster={item.image} />
  }

  if (item.portraitVideo) {
    return <PortraitPhoneCard src={item.portraitVideo} poster={item.image} />
  }

  if (item.video) {
    return <SingleVideoCover src={item.video} poster={item.image} />
  }

  if (item.laptopVideo) {
    return <LaptopVideoCover src={item.laptopVideo} poster={item.image} coverImage={item.coverImage} />
  }

  if (item.coverImage && item.coverImageMobile) {
    return (
      <div className="aspect-video relative flex items-center justify-center overflow-hidden border-b border-border/20 bg-[#1E1E21]">
        <Image
          src={item.coverImage}
          alt=""
          fill
          className="object-cover scale-110 blur-[2px] brightness-50 transition-transform duration-500 group-hover:scale-[1.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="relative z-10 w-[42%] sm:w-[38%] aspect-[9/19.5] rounded-[20px] border-[3px] border-[#3A3A3D] bg-black shadow-2xl transition-transform duration-500 group-hover:scale-[1.05]">
          <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-8 h-1.5 rounded-full bg-[#3A3A3D] z-10" />
          <div className="relative w-full h-full rounded-[17px] overflow-hidden">
            <Image src={item.coverImageMobile} alt={item.title} fill className="object-cover" />
          </div>
        </div>
      </div>
    )
  }

  if (item.image) {
    return (
      <div className="aspect-video relative flex items-center justify-center overflow-hidden border-b border-border/20 bg-[#1E1E21]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    )
  }

  return (
    <div className="aspect-video bg-gradient-to-br from-primary/5 via-[#1E1E21] to-[#252528] relative flex items-center justify-center overflow-hidden border-b border-border/20 p-4">
      <div className="absolute top-2 left-3 flex space-x-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20" />
      </div>
      <div className="w-4/5 h-[80%] mt-6 rounded-lg bg-card/40 border border-border/20 shadow-lg p-3 flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.03]">
        <div className="flex justify-between items-center border-b border-border/10 pb-2">
          <div className="w-12 h-3 rounded bg-primary/20" />
          <div className="flex space-x-2">
            <div className="w-6 h-2 rounded bg-[#8E8E92]/20" />
            <div className="w-6 h-2 rounded bg-[#8E8E92]/20" />
          </div>
        </div>
        <div className="space-y-2 py-2 flex-1">
          <div className="w-3/4 h-4 rounded bg-foreground/10" />
          <div className="w-full h-3 rounded bg-muted-foreground/10" />
          <div className="w-5/6 h-3 rounded bg-muted-foreground/10" />
        </div>
        <div className="flex justify-start">
          <div className="w-16 h-5 rounded bg-primary/80" />
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl transition-all duration-500 group-hover:w-36 group-hover:h-36 group-hover:bg-primary/20" />
    </div>
  )
}

function SingleVideoCover({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useVideoInView()
  return (
    <div className="aspect-video relative overflow-hidden border-b border-border/20 bg-[#0A0908]">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  )
}

function CyclingCover({ videos, poster }: { videos: string[]; poster?: string }) {
  const [current, setCurrent] = useState(0)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) {
          const video = videoRef.current
          if (video) requestPause(video)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      const video = videoRef.current
      if (video && shouldAutoPlayVideo()) {
        requestPlay(video)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [current, inView])

  function advance() {
    setCurrent((i) => (i + 1) % videos.length)
  }

  return (
    <div ref={containerRef} className="aspect-video relative overflow-hidden border-b border-border/20 bg-[#0A0908]">
      <video
        key={current}
        ref={videoRef}
        src={videos[current]}
        poster={current === 0 ? poster : undefined}
        muted
        playsInline
        preload="none"
        onEnded={advance}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  )
}

function LaptopVideoCover({ src, poster, coverImage }: { src: string; poster?: string; coverImage?: string }) {
  const videoRef = useVideoInView()
  return (
    <div className="aspect-video relative flex items-end justify-center overflow-hidden bg-[#1E1E21] pb-[5%]">
      {coverImage && (
        <Image
          src={coverImage}
          alt=""
          fill
          className="object-cover scale-110 blur-[3px] brightness-[0.35] transition-transform duration-500 group-hover:scale-[1.15]"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div
        className="relative z-10 w-[74%] flex flex-col items-center transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.95)) drop-shadow(0 4px 10px rgba(0,0,0,0.7))' }}
      >
        {/* Lid */}
        <div className="w-full" style={{
          background: 'linear-gradient(165deg, #5c5c5e 0%, #4a4a4c 18%, #3c3c3e 52%, #2e2e30 100%)',
          borderRadius: '8px 8px 1.5px 1.5px',
          padding: '4px 4px 3px',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.8)',
        }}>
          <div style={{ background: '#090909', borderRadius: '5px', padding: '5px 5px 3px', position: 'relative' }}>
            {/* Camera */}
            <div style={{
              position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)',
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #2a2a2c, #080808)',
              zIndex: 10,
            }} />
            {/* Screen */}
            <div style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: '2px', position: 'relative', background: '#000' }}>
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 18px rgba(0,0,0,0.5)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
        {/* Hinge */}
        <div style={{ width: '99%', height: '1.5px', background: 'linear-gradient(90deg, #0d0d0f, #050507 50%, #0d0d0f)' }} />
        {/* Base */}
        <div style={{
          width: '110%', height: '13px',
          background: 'linear-gradient(180deg, #464648 0%, #3e3e40 35%, #363636 100%)',
          borderRadius: '0 0 5px 5px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 3px 10px rgba(0,0,0,0.7)',
        }} />
      </div>
    </div>
  )
}

function PortraitPhoneCard({ src, poster }: { src: string; poster?: string }) {
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const videoRef = useVideoInView()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [videoRef])

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      requestPause(video)
    } else {
      requestPlay(video)
    }
  }

  return (
    <div className="aspect-video relative flex items-center justify-center overflow-hidden border-b border-border/20 bg-[#0A0908]">
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          className="object-cover blur-[6px] brightness-[0.25] scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 h-[88%] aspect-[9/19.5] rounded-[20px] border-[3px] border-[#3A3A3D] bg-black shadow-2xl transition-transform duration-500 group-hover:scale-[1.04]">
        <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-8 h-1.5 rounded-full bg-[#3A3A3D] z-10" />
        <div className="relative w-full h-full rounded-[17px] overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
