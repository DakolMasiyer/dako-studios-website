import type { Metadata } from 'next'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { AboutSection } from '../landing/components/about-section'
import { HowItWorksSection } from '../landing/components/how-it-works-section'
import { CTASection } from '../landing/components/cta-section'

export const metadata: Metadata = {
  title: 'About | Dako Studios',
  description: 'A founder-led studio crafting high-performance digital products. Based in Abuja, Nigeria — serving businesses across Nigeria and the diaspora.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <AboutSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
