import type { Metadata } from 'next'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { PricingSection } from '../landing/components/pricing-section'
import { FaqSection } from '../landing/components/faq-section'
import { CTASection } from '../landing/components/cta-section'

export const metadata: Metadata = {
  title: 'Pricing | Dako Studios',
  description: 'Transparent, project-based pricing — no retainers, no hidden fees. From $1,000 for a clean conversion site to custom builds. You own everything.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <PricingSection />
        <FaqSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
