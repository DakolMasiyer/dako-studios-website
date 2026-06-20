"use client"

import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonialAvatars = [
  { initials: 'SG', label: 'Steve Gukas' },
  { initials: 'NB', label: 'Nono Bukiti' },
  { initials: 'DA', label: 'David, Amnik' },
]

const LINE_1 = 'One Creative Studio.'
const LINE_2 = 'Every Edge.'

// PageLoader fades at 1.4s — start hero animations in sync with that fade
const LOADER_OFFSET = 1.4

function WordReveal({
  text,
  startDelay = 0,
  className,
}: {
  text: string
  startDelay?: number
  className?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: 0,
            animation: `blurIn 0.65s ease-out ${(LOADER_OFFSET + startDelay + i * 0.08).toFixed(2)}s both`,
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

export function HeroSection() {
  const line1Words = LINE_1.split(' ').length
  const line2Words = LINE_2.split(' ').length
  // WordReveal adds LOADER_OFFSET internally, so startDelay is relative
  const line2Start = line1Words * 0.08 + 0.06
  // Subtitle and CTA are absolute delays (not through WordReveal)
  const subtitleDelay = LOADER_OFFSET + line2Start + line2Words * 0.08 + 0.18
  const ctaDelay = subtitleDelay + 0.2

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-dvh flex items-center justify-center pt-24 pb-20 bg-background"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(var(--primary) / 0.10) 0%, transparent 70%)',
        }}
      />


<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">

          {/* Headline — word-by-word blur-focus reveal */}
          <h1 className="mb-6 leading-[0.9] tracking-tight">
            <WordReveal
              text={LINE_1}
              startDelay={0}
              className="block font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-foreground"
            />
            <WordReveal
              text={LINE_2}
              startDelay={line2Start}
              className="block font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-primary mt-2"
            />
          </h1>

          {/* Subtitle */}
          <p
            style={{
              opacity: 0,
              animation: `fadeUp 0.6s ease-out ${subtitleDelay.toFixed(2)}s both`,
            }}
            className="mx-auto mb-10 max-w-xl text-lg sm:text-xl text-muted-foreground font-light leading-relaxed text-balance"
          >
            Built for the businesses building Africa&apos;s next chapter.
          </p>

          {/* CTA row */}
          <div
            style={{
              opacity: 0,
              animation: `fadeUp 0.6s ease-out ${ctaDelay.toFixed(2)}s both`,
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Primary CTA — animated pill */}
            <Button
              asChild
              className="relative text-base font-semibold rounded-full h-12 p-1 ps-6 pr-14 group transition-all duration-500 hover:ps-12 hover:pr-4 overflow-hidden bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer shadow-sm"
            >
              <Link href="/contact">
                <span className="relative z-10 transition-all duration-500">Start a Project</span>
                <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            </Button>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {testimonialAvatars.map((a) => (
                  <div
                    key={a.initials}
                    aria-label={a.label}
                    className="w-9 h-9 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0"
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-none">
                  20+ projects delivered
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
