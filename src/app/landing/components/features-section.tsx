"use client"

import Link from 'next/link'
import { Terminal, Sparkles, Video, Clapperboard, GraduationCap, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { services } from '@/data/services'

const iconMap = {
  labs: Terminal,
  brand: Sparkles,
  motion: Video,
  film: Clapperboard,
  academy: GraduationCap,
}

export function FeaturesSection() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-background border-t border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            What We Do
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground mb-6">
            Five arms. One studio.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            We build digital presences that convert — web design, brand identity, motion, film, and skills training. All under one roof.
          </p>
        </div>

        {/* Services Grid (Using the 1px border grid pattern from the design system) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[1px] bg-border/40 border border-border/40 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.id as keyof typeof iconMap] || Terminal
            const serviceNumber = String(index + 1).padStart(2, '0')
            const isExternal = service.href?.startsWith('http')

            const cardContent = (
              <div
                className={`bg-card p-7 pb-12 transition-all duration-200 relative group h-full flex flex-col justify-between min-h-[300px] ${
                  service.isClickable 
                    ? 'hover:bg-muted cursor-pointer' 
                    : 'opacity-60 cursor-default'
                }`}
              >
                <div>
                  {/* Service Number */}
                  <div className="font-mono text-xs text-muted-foreground/40 mb-6 font-semibold">
                    {serviceNumber}
                  </div>

                  {/* Icon & Label */}
                  <div className="flex items-center space-x-2.5 mb-4">
                    <IconComponent className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-primary uppercase">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg font-bold text-foreground mb-3 tracking-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Arrow indicator for interactive cards */}
                {service.isClickable && (
                  <span className="absolute bottom-6 right-6 text-muted-foreground/60 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                )}
              </div>
            )

            if (service.isClickable && service.href) {
              if (isExternal) {
                return (
                  <a
                    href={service.href}
                    key={service.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cardContent}
                  </a>
                )
              }
              return (
                <Link href={service.href} key={service.id}>
                  {cardContent}
                </Link>
              )
            }

            return <div key={service.id}>{cardContent}</div>
          })}
        </div>
      </div>
    </section>
  )
}
