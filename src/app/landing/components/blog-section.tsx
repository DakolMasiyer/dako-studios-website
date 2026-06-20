"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Globe, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { portfolioItems, PortfolioItem } from '@/data/portfolio'
import { CaseStudy } from '@/utils/case-studies'
import { services } from '@/data/services'
import { useVideoInView, requestPlay, requestPause } from '@/hooks/use-video-in-view'

interface BlogSectionProps {
  caseStudies: CaseStudy[]
}

function armLabel(armId: string) {
  return services.find((s) => s.id === armId)?.subtitle || armId
}

function ArmBadge({ armId }: { armId: string }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
      {armLabel(armId)}
    </span>
  )
}

function VideoCard({ item }: { item: PortfolioItem }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const videoRef = useVideoInView()

  // Keep UI in sync with actual video state (including observer-driven changes)
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

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      requestPause(video)
    } else {
      requestPlay(video)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black group">
      <video
        ref={videoRef}
        src={item.video}
        loop
        muted
        playsInline
        preload="auto"
        poster={item.image}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div className="absolute top-4 left-4">
        <ArmBadge armId={item.arm || 'motion'} />
      </div>

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

function CyclingVideoCard({ item }: { item: PortfolioItem }) {
  const videos = item.videos ?? []
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Observe the container (not the video — video remounts on key change)
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

  // Play on in-view, and re-play when video cycles (key remount)
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      const video = videoRef.current
      if (video) requestPlay(video)
    }, 0)
    return () => clearTimeout(timer)
  }, [current, inView])

  // Sync playing state with video events (re-attach on each cycle)
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
  }, [current])

  function advance() {
    setCurrent((i) => (i + 1) % videos.length)
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

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black group">
      <video
        key={current}
        ref={videoRef}
        src={videos[current]}
        muted
        playsInline
        preload="auto"
        poster={current === 0 ? item.image : undefined}
        onEnded={advance}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      <div className="absolute top-4 left-4">
        <ArmBadge armId={item.arm || 'motion'} />
      </div>

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

// The daanong browser mockup screen recording — plays only when scrolled into view
function DaanongScreenRecording() {
  const videoRef = useVideoInView()
  return (
    <video
      ref={videoRef}
      src="/videos/daanong-scroll.mp4"
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover object-top"
    />
  )
}

function ImageCard({
  title,
  armId,
  imageSrc,
  href,
}: {
  title: string
  armId: string
  imageSrc: string
  href: string
}) {
  const inner = (
    <div className="relative w-full h-full overflow-hidden bg-[#1E1E21] group">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="absolute top-4 left-4">
        <ArmBadge armId={armId} />
      </div>

      <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
        <ArrowUpRight className="h-4 w-4 text-white" />
      </div>
    </div>
  )

  return href.startsWith('/') ? (
    <Link href={href} className="block w-full h-full cursor-pointer">{inner}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer">{inner}</a>
  )
}

export function BlogSection({ caseStudies }: BlogSectionProps) {
  const getCS = (slug: string) => caseStudies.find((cs) => cs.slug === slug)
  const getPortfolio = (id: string) => portfolioItems.find((p) => p.id === id)

  const sporton = getCS('sporton-brand-development-strategy')
  const kiichen = getCS('the-kiichen-ux-mobile-app-design')
  const firstFeatures = getCS('first-features-digital-marketing-strategy')
  const daanong = getPortfolio('daanong-gyang')
  const getly = getPortfolio('getly-motion')
  const serum = getPortfolio('faceserum-motion')
  const syncmaster = getPortfolio('syncmaster-motion')

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-background border-y border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Selected Work
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
            Recent projects.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Premium digital experiences for businesses that take their presence seriously.
          </p>
        </div>

        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-6xl mx-auto">

          {/* Row 1: Getly video — full width */}
          {getly && (
            <div className="sm:col-span-2 aspect-video rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <VideoCard item={getly} />
            </div>
          )}

          {/* Row 2: Sporton + Kiichen — portrait pair */}
          {sporton && (
            <div className="aspect-[3/4] rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <ImageCard
                title={sporton.title}
                armId={sporton.arm}
                imageSrc={sporton.heroImage}
                href={`/case-studies/${sporton.slug}`}
              />
            </div>
          )}
          {kiichen && (
            <div className="aspect-[3/4] rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <ImageCard
                title={kiichen.title}
                armId={kiichen.arm}
                imageSrc={kiichen.heroImage}
                href={`/case-studies/${kiichen.slug}`}
              />
            </div>
          )}

          {/* Row 3: Da'anong website — full width, browser mockup with screen recording */}
          {daanong && (
            <a
              href={daanong.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-2 aspect-video rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group block relative bg-[#1E1E21] flex items-center justify-center"
            >
              {daanong.coverImage && (
                <Image
                  src={daanong.coverImage}
                  alt=""
                  fill
                  className="object-cover scale-110 blur-[3px] brightness-[0.35] transition-transform duration-500 group-hover:scale-[1.15]"
                  sizes="(max-width: 768px) 100vw, 1152px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* High-fidelity MacBook Pro mockup */}
              <div
                className="relative z-10 w-[52%] sm:w-[70%] lg:w-[75%] flex flex-col items-center transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.95)) drop-shadow(0 6px 12px rgba(0,0,0,0.65))' }}
              >
                {/* === SCREEN LID — Space Gray aluminum casing === */}
                <div
                  className="w-full relative"
                  style={{
                    background: 'linear-gradient(172deg, #5c5c5e 0%, #4a4a4c 18%, #3c3c3e 48%, #2e2e30 100%)',
                    borderRadius: '11px 11px 2px 2px',
                    padding: '5px 5px 4px',
                    boxShadow:
                      'inset 0 1.5px 0 rgba(255,255,255,0.22),' +
                      'inset 0 -1px 0 rgba(0,0,0,0.35),' +
                      '0 0 0 0.5px rgba(0,0,0,0.75)',
                  }}
                >
                  {/* Top-edge aluminum highlight */}
                  <div
                    className="absolute top-0 left-[5%] right-[5%]"
                    style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.62) 28%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.62) 72%, transparent)',
                      borderRadius: '9999px',
                    }}
                  />

                  {/* Inner screen panel — black bezel */}
                  <div
                    className="w-full relative overflow-hidden"
                    style={{
                      background: '#090909',
                      borderRadius: '7px 7px 1px 1px',
                      boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.07)',
                    }}
                  >
                    {/* Top bezel + camera */}
                    <div className="w-full flex items-center justify-center" style={{ height: '16px' }}>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle at 38% 36%, #2c2c30, #0e0e10)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09), 0 0 0 2px rgba(0,0,0,0.45)',
                        }}
                      />
                    </div>

                    {/* Screen content */}
                    <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <DaanongScreenRecording />
                    </div>

                    {/* Screen-edge vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ boxShadow: 'inset 0 0 22px rgba(0,0,0,0.55)', borderRadius: 'inherit' }}
                    />
                  </div>

                  {/* Hinge-side darkening */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: '4px', background: 'linear-gradient(180deg, #1c1c1e, #101012)', borderRadius: '0 0 2px 2px' }}
                  />
                </div>

                {/* === HINGE GROOVE === */}
                <div
                  className="w-[99%]"
                  style={{ height: '2px', background: 'linear-gradient(90deg, #101012, #070709 50%, #101012)' }}
                />

                {/* === KEYBOARD BASE — slightly wider than lid === */}
                <div className="relative" style={{ width: '110%' }}>
                  <div
                    className="w-full relative"
                    style={{
                      height: '22px',
                      background: 'linear-gradient(180deg, #4c4c4e 0%, #3e3e40 40%, #303032 100%)',
                      borderRadius: '0 0 7px 7px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.13), 0 4px 14px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Touch Bar */}
                    <div
                      className="absolute top-0 left-[17%] right-[17%]"
                      style={{ height: '2px', background: 'linear-gradient(180deg, #141416, #1c1c1e)', borderRadius: '0 0 2px 2px' }}
                    />
                    {/* Speaker dots — left */}
                    <div className="absolute flex gap-[2.5px]" style={{ top: '50%', transform: 'translateY(-50%)', left: '4%' }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(0,0,0,0.42)' }} />
                      ))}
                    </div>
                    {/* Speaker dots — right */}
                    <div className="absolute flex gap-[2.5px]" style={{ top: '50%', transform: 'translateY(-50%)', right: '4%' }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ width: '2px', height: '2px', borderRadius: '50%', background: 'rgba(0,0,0,0.42)' }} />
                      ))}
                    </div>
                    {/* Bottom edge */}
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: '3px', background: 'rgba(0,0,0,0.28)', borderRadius: '0 0 7px 7px' }}
                    />
                  </div>
                </div>

                {/* Floor shadow */}
                <div
                  style={{
                    width: '84%',
                    height: '10px',
                    background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,0.5), transparent)',
                  }}
                />
              </div>

              <div className="absolute top-4 left-4 z-20">
                <ArmBadge armId={daanong.arm || 'labs'} />
              </div>

              <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-white/50 text-xs font-semibold group-hover:text-white/80 transition-colors duration-300">
                <Globe className="h-3.5 w-3.5" />
                Live Site
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>
          )}

          {/* Row 4: Face Serum video — full width */}
          {serum && (
            <div className="sm:col-span-2 aspect-video rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <VideoCard item={serum} />
            </div>
          )}

          {/* Row 5: SyncMaster cycling video — full width */}
          {syncmaster && syncmaster.videos && (
            <div className="sm:col-span-2 aspect-video rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <CyclingVideoCard item={syncmaster} />
            </div>
          )}

          {/* Row 6: First Features — full width */}
          {firstFeatures && (
            <div className="sm:col-span-2 aspect-video rounded-[8px] overflow-hidden border border-border/20 hover:border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
              <ImageCard
                title={firstFeatures.title}
                armId={firstFeatures.arm}
                imageSrc={firstFeatures.heroImage}
                href={`/case-studies/${firstFeatures.slug}`}
              />
            </div>
          )}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] border border-border/40 text-sm font-semibold text-foreground hover:border-primary/60 hover:text-primary transition-all duration-300"
          >
            View all work
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
