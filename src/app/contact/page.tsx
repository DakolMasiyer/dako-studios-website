import type { Metadata } from 'next'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { ContactSection } from '../landing/components/contact-section'

export const metadata: Metadata = {
  title: 'Start a Project | Dako Studios',
  description: 'Book a free discovery call or send us a brief. We respond within 2 hours during business hours. Based in Abuja, serving Nigeria and the diaspora.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main className="pt-8">
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}
