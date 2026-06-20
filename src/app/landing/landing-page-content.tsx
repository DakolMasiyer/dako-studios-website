"use client"

import React from 'react'
import { CaseStudy } from '@/utils/case-studies'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { FeaturesSection } from './components/features-section'
import { BlogSection } from './components/blog-section'
import { LogoCarousel } from './components/logo-carousel'
import { StatsSection } from './components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CTASection } from './components/cta-section'
import { LandingFooter } from './components/footer'

interface LandingPageContentProps {
  caseStudies: CaseStudy[]
}

export function LandingPageContent({ caseStudies }: LandingPageContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main>
        <HeroSection />
        <LogoCarousel />
        <BlogSection caseStudies={caseStudies} />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  )
}
