"use client"

import { Badge } from '@/components/ui/badge'

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Badge */}
          <div className="flex justify-center mb-8">
            <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block">
              Our Story
            </span>
          </div>
          
          {/* Main Statement */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-foreground leading-tight">
              A founder-led studio crafting high-performance digital products.
            </h2>
            
            <div className="h-[1px] w-12 bg-primary mx-auto my-8"></div>
            
            <div className="space-y-6 max-w-2xl mx-auto text-lg text-muted-foreground font-light leading-relaxed">
              <p>
                Dako Studios brings together design, development, and strategy under one roof. We reject bloated agency retainers and endless project timelines to build high-end websites designed specifically to convert visitors into customers.
              </p>
              <p className="font-semibold text-foreground">
                Founded in Abuja, Nigeria. Serving clients worldwide.
              </p>
            </div>
            
            {/* Signature or Founder Mark */}
            <div className="pt-8 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold font-display text-lg mb-3">
                D
              </div>
              <span className="text-sm font-semibold tracking-wide text-foreground">Dakolmas Iyer</span>
              <span className="text-xs text-muted-foreground mt-0.5">Founder & Lead Engineer, Dako Studios</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
