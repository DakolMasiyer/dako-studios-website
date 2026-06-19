"use client"

import React from 'react'
import { CaseStudy } from '@/utils/case-studies'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { FeaturesSection } from './components/features-section'
import { BlogSection } from './components/blog-section'
import { LogoCarousel } from './components/logo-carousel'
import { StatsSection } from './components/stats-section'
import { TestimonialsSection } from './components/testimonials-section'
import { PricingSection } from './components/pricing-section'
import { FaqSection } from './components/faq-section'
import { CTASection } from './components/cta-section'
import { AboutSection } from './components/about-section'
import { HowItWorksSection } from './components/how-it-works-section'
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
        <FeaturesSection />
        <HowItWorksSection />
        <BlogSection caseStudies={caseStudies} />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
        <AboutSection />
      </main>

      <LandingFooter />
    </div>
  )
}
