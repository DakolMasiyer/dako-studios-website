"use client"

import { ArrowRight, Zap, Trophy, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DotPattern } from '@/components/dot-pattern'

export function HeroSection() {
  const smoothScrollTo = (targetId: string) => {
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section id="hero" className="relative overflow-hidden bg-background pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <DotPattern className="opacity-40" size="md" fadeStyle="ellipse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="mb-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-none text-foreground">
            One Creative Studio.
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent block mt-2">
              Every Edge.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed text-balance">
            Built for the businesses building Africa's next chapter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16">
            <Button
              size="lg"
              className="text-base cursor-pointer font-semibold px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/95 rounded-[4px]"
              onClick={() => smoothScrollTo('#services')}
            >
              See Real Work
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base cursor-pointer font-semibold px-8 h-12 border-border/40 hover:bg-secondary hover:text-foreground rounded-[4px]"
              onClick={() => smoothScrollTo('#contact')}
            >
              Book a Discovery Call
            </Button>
          </div>

          {/* Trust Bar (Using the specific stats values from the design system) */}
          <div className="border-t border-b border-border/20 py-6 mx-auto max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-2.5 text-foreground/80">
                <Trophy className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="font-display font-extrabold text-lg leading-none">20+</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Projects Delivered</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2.5 text-foreground/80 border-t md:border-t-0 md:border-l md:border-r border-border/20 pt-4 md:pt-0">
                <Zap className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="font-display font-extrabold text-lg leading-none">6 × #1</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Films Topped Prime Video Nigeria</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2.5 text-foreground/80 border-t md:border-t-0 pt-4 md:pt-0">
                <Globe className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="font-display font-extrabold text-lg leading-none">NG+</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Nigeria &amp; Diaspora</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
