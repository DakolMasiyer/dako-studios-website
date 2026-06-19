import type { Metadata } from 'next'
import { LandingPageContent } from './landing/landing-page-content'
import { getCaseStudies } from '@/utils/case-studies'

export const metadata: Metadata = {
  title: 'Dako Studios | One Creative Studio. Every Edge.',
  description: 'Built for the businesses building Africa\'s next chapter. Websites, brand identity, motion, and film marketing — fully yours at launch. Based in Abuja, serving Nigeria and the diaspora.',
  keywords: ['web design', 'web development', 'brand identity', 'Abuja', 'dako.studio', 'Nigeria web design', 'diaspora business websites'],
}

export default function HomePage() {
  const caseStudies = getCaseStudies()
  return <LandingPageContent caseStudies={caseStudies} />
}
