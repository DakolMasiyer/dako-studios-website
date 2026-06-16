"use client"

import React from 'react'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { FeaturesSection } from './components/features-section'
import { BlogSection } from './components/blog-section'
import { AboutSection } from './components/about-section'
import { ContactSection } from './components/contact-section'
import { LandingFooter } from './components/footer'

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <BlogSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
