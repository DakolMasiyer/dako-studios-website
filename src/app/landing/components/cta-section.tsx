"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none">
            Your next client is already searching.
            <span className="block mt-2 text-primary">Let&apos;s make sure they find you.</span>
          </h2>

          <p className="text-lg text-background/70 font-light leading-relaxed max-w-xl mx-auto">
            Discovery call is free. No pitch decks, no jargon — just a straight conversation about what you need and whether we&apos;re the right fit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="cursor-pointer px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] font-semibold"
              asChild
            >
              <a href="#contact">
                Book a Discovery Call
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer px-8 h-12 border-background/20 text-background bg-transparent hover:bg-background/10 hover:text-background rounded-[4px] font-semibold"
              asChild
            >
              <a href="#portfolio">View Our Work</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-background/50">
            <span>20+ Projects Delivered</span>
            <Separator orientation="vertical" className="h-4 bg-background/20 hidden sm:block" />
            <span>Full Ownership at Handoff</span>
            <Separator orientation="vertical" className="h-4 bg-background/20 hidden sm:block" />
            <span>7–10 Day Builds</span>
          </div>
        </div>
      </div>
    </section>
  )
}
