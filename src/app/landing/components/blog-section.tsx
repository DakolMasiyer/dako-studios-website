"use client"

import { ArrowUpRight, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { portfolioItems } from '@/data/portfolio'

export function BlogSection() {
  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-background border-y border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
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

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portfolioItems.map((item, index) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden border border-border/20 bg-card hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between group rounded-[8px] ${
                index >= 3 ? 'lg:col-span-1' : '' // keeps it clean
              }`}
            >
              <CardContent className="p-0 flex-1 flex flex-col justify-between">
                {/* Visual Browser Mockup (Premium CSS-only card preview) */}
                <div className="aspect-video bg-gradient-to-br from-primary/5 via-[#1E1E21] to-[#252528] relative flex items-center justify-center overflow-hidden border-b border-border/20 p-4">
                  {/* Floating Browser Top Bar */}
                  <div className="absolute top-2 left-3 flex space-x-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                  </div>
                  
                  {/* Floating abstract UI mockup representing the niche */}
                  <div className="w-4/5 h-[80%] mt-6 rounded-lg bg-card/40 border border-border/20 shadow-lg p-3 flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.03]">
                    {/* Header mockup */}
                    <div className="flex justify-between items-center border-b border-border/10 pb-2">
                      <div className="w-12 h-3 rounded bg-primary/20"></div>
                      <div className="flex space-x-2">
                        <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
                        <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
                      </div>
                    </div>
                    {/* Content mockup */}
                    <div className="space-y-2 py-2 flex-1">
                      <div className="w-3/4 h-4 rounded bg-foreground/10"></div>
                      <div className="w-full h-3 rounded bg-muted-foreground/10"></div>
                      <div className="w-5/6 h-3 rounded bg-muted-foreground/10"></div>
                    </div>
                    {/* CTA mockup */}
                    <div className="flex justify-start">
                      <div className="w-16 h-5 rounded bg-primary/80"></div>
                    </div>
                  </div>
                  
                  {/* Backdrop Glow */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl transition-all duration-500 group-hover:w-36 group-hover:h-36 group-hover:bg-primary/20"></div>
                </div>

                {/* Details Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase block">
                      {item.niche}
                    </span>
                    <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                    <Badge variant="outline" className="border-border text-muted-foreground font-normal text-xs">
                      Concept Project
                    </Badge>
                    <a
                      href={item.href}
                      className="inline-flex items-center text-primary hover:text-primary/90 text-sm font-semibold group-hover:underline cursor-pointer"
                    >
                      <Globe className="h-4 w-4 mr-1.5" />
                      Live Demo
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
