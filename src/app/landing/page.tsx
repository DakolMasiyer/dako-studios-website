import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

// Metadata for the landing page
export const metadata: Metadata = {
  title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
  description: 'Dako Studios builds websites and brand assets that actually convert — and hands you full ownership at launch. No retainer. Web design, brand identity, motion, and film marketing.',
  keywords: ['web design', 'web development', 'brand identity', 'dako.studio', 'Nigeria web design', 'creative studio'],
  openGraph: {
    title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
    description: 'Five disciplines, one studio: web design, brand identity, motion, film marketing, and digital skills training.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
    description: 'Five disciplines, one studio: web design, brand identity, motion, film marketing, and digital skills training.',
  },
}

export default function LandingPage() {
  return <LandingPageContent />
}
