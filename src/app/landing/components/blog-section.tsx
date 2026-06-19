"use client"

import Link from 'next/link'
import { ArrowUpRight, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { portfolioItems, PortfolioItem } from '@/data/portfolio'
import { CaseStudy } from '@/utils/case-studies'
import { services } from '@/data/services'
import { PortfolioCardVisual } from '@/components/portfolio-card-visual'

interface BlogSectionProps {
  caseStudies: CaseStudy[]
}

export function BlogSection({ caseStudies }: BlogSectionProps) {
  const caseStudyCards: PortfolioItem[] = caseStudies.map((cs) => ({
    id: cs.slug,
    title: cs.title,
    niche: services.find((s) => s.id === cs.arm)?.subtitle || cs.arm,
    description: cs.summary,
    image: cs.heroImage,
    href: '#',
    category: cs.tags[0] || 'Case Study',
    arm: cs.arm,
    slug: cs.slug,
  }))

  const featuredItems = portfolioItems.filter((item) => item.featured)
  const items: PortfolioItem[] = [...featuredItems, ...caseStudyCards]

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
          {items.map((item, index) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden border border-border/20 bg-card hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between group rounded-[8px] ${
                index >= 3 ? 'lg:col-span-1' : '' // keeps it clean
              }`}
            >
              <CardContent className="p-0 flex-1 flex flex-col justify-between">
                <PortfolioCardVisual item={item} />

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
                      Client Work
                    </Badge>
                    {item.href !== '#' ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center text-primary hover:text-primary/90 text-sm font-semibold group-hover:underline cursor-pointer"
                      >
                        <Globe className="h-4 w-4 mr-1.5" />
                        Live Site
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </a>
                    ) : item.slug ? (
                      <Link
                        href={`/case-studies/${item.slug}`}
                        className="inline-flex items-center text-primary hover:text-primary/90 text-sm font-semibold group-hover:underline cursor-pointer"
                      >
                        Case Study
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center text-muted-foreground text-sm font-medium">
                        Case Study
                      </span>
                    )}
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
