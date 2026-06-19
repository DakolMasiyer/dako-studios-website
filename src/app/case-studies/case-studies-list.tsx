"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CaseStudy } from '@/utils/case-studies'
import { services } from '@/data/services'
import { ArrowRight } from 'lucide-react'

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
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-border/20 pb-8">
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

        {/* Grid */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCaseStudies.map((cs) => (
              <article
                key={cs.slug}
                className="group relative flex flex-col overflow-hidden rounded-[8px] border border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
              >
                <Link href={`/case-studies/${cs.slug}`} className="cursor-pointer">
                  {cs.heroImage && (
                    <div className="relative aspect-video w-full overflow-hidden border-b border-border/20">
                      <Image
                        src={cs.heroImage}
                        alt={cs.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                      {armLabel(cs.arm)}
                    </span>

                    <h2 className="text-xl font-display font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                      <Link href={`/case-studies/${cs.slug}`} className="cursor-pointer">
                        {cs.title}
                      </Link>
                    </h2>

                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
                      {cs.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/20 pt-4 mt-auto">
                    <span className="text-xs text-muted-foreground/60">{cs.client}</span>
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      Read Case Study
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
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
