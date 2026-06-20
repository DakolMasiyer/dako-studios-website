"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Globe, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { portfolioItems, PortfolioItem } from '@/data/portfolio'
import { CaseStudy } from '@/utils/case-studies'
import { services } from '@/data/services'

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
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
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
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={item.image}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Arm badge — only text on card */}
      <div className="absolute top-4 left-4">
        <ArmBadge armId={item.arm || 'motion'} />
      </div>

      {/* Controls — Humaan-style: mute then pause, bottom-right */}
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

      {/* Arm badge only */}
      <div className="absolute top-4 left-4">
        <ArmBadge armId={armId} />
      </div>

      {/* Arrow — click signal without text */}
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
              {/* Blurred hero background */}
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

              {/* Browser window mockup */}
              <div className="relative z-10 w-[74%] aspect-[16/10] rounded-[10px] border border-[#3A3A3D] bg-[#1C1C1E] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                {/* macOS browser chrome */}
                <div className="h-7 bg-[#2C2C2E] border-b border-[#3A3A3D] flex items-center px-3 gap-2.5 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 h-4 rounded-full bg-[#3A3A3D] flex items-center px-3">
                    <span className="text-[#8E8E92] text-[9px] font-mono truncate select-none">
                      dwain-gyang-dp.netlify.app
                    </span>
                  </div>
                </div>
                {/* Screen recording */}
                <video
                  src="/videos/daanong-scroll.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Arm badge */}
              <div className="absolute top-4 left-4">
                <ArmBadge armId={daanong.arm || 'labs'} />
              </div>

              {/* Live site link signal */}
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

          {/* Row 5: First Features — full width */}
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
