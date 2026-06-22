"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Volume2, VolumeX } from 'lucide-react'
import { CaseStudy } from '@/utils/case-studies'
import { services } from '@/data/services'
import { useVideoInView } from '@/hooks/use-video-in-view'

function VideoThumbnail({ src, alt }: { src: string; alt: string }) {
  const [muted, setMuted] = useState(true)
  const videoRef = useVideoInView()

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        aria-label={alt}
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer opacity-70 hover:opacity-100"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  )
}

interface CaseStudiesListProps {
  initialCaseStudies: CaseStudy[]
}

export function CaseStudiesList({ initialCaseStudies }: CaseStudiesListProps) {
  const [selectedArm, setSelectedArm] = useState<string>('All')

  const arms = useMemo(() => {
    const present = new Set(initialCaseStudies.map((cs) => cs.arm))
    return ['All', ...services.filter((s) => present.has(s.id)).map((s) => s.id)]
  }, [initialCaseStudies])

  const armLabel = (armId: string) => services.find((s) => s.id === armId)?.subtitle || armId

  const filteredCaseStudies = useMemo(() => {
    if (selectedArm === 'All') return initialCaseStudies
    return initialCaseStudies.filter((cs) => cs.arm === selectedArm)
  }, [initialCaseStudies, selectedArm])

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Case Studies
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4 text-foreground">
            Our body of work.
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Real projects, real results — across web, brand, motion, and film.
          </p>
        </div>

        {/* Arm filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 border-b border-border/20 pb-8">
          {arms.map((armId) => (
            <button
              key={armId}
              onClick={() => setSelectedArm(armId)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                selectedArm === armId
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {armId === 'All' ? 'All' : armLabel(armId)}
            </button>
          ))}
        </div>

        {/* 2-column grid */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 sm:gap-y-16">
            {filteredCaseStudies.map((cs) => (
              <article key={cs.slug} className="group">
                {/* Thumbnail — video if available, else image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] mb-5 border border-border/20 bg-black">
                  {(cs.videos[0] ?? cs.video) ? (
                    <VideoThumbnail
                      src={(cs.videos[0] ?? cs.video)!}
                      alt={cs.client}
                    />
                  ) : cs.heroImage ? (
                    <Image
                      src={cs.heroImage}
                      alt={cs.client}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted to-muted" />
                  )}
                  {/* Click-to-navigate overlay — sits below the mute button (z-10) so the button stays clickable */}
                  <Link
                    href={`/case-studies/${cs.slug}`}
                    className="absolute inset-0"
                    aria-label={cs.client}
                  />
                </div>

                {/* Client name */}
                <Link href={`/case-studies/${cs.slug}`} className="block">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                    {cs.client}
                  </h2>
                </Link>

                {/* Tags */}
                {cs.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-muted/60 text-muted-foreground rounded-full font-medium border border-border/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border/40 rounded-[8px]">
            <p className="text-muted-foreground font-light text-lg">No case studies found for this arm yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
