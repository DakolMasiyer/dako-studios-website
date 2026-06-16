import type { Metadata } from 'next'
import { LandingPageContent } from './landing/landing-page-content'

export const metadata: Metadata = {
  title: 'Dako Studios | Premium Web Design & Development',
  description: 'Your business deserves a website that actually works. We design and build premium websites for law firms, clinics, real estate agencies, and professional services — delivered in days, not months. Based in Abuja, serving clients worldwide.',
  keywords: ['web design', 'web development', 'Abuja', 'dako.studio', 'law firm websites', 'clinic websites', 'real estate websites'],
}

export default function HomePage() {
  return <LandingPageContent />
}
