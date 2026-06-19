"use client"

import React from 'react'
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
import { ContactSection } from './components/contact-section'
import { LandingFooter } from './components/footer'

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <BlogSection />
        <LogoCarousel />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
        <AboutSection />
        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  )
}
