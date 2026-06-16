import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

// Metadata for the landing page
export const metadata: Metadata = {
  title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
  description: 'Five disciplines, one studio: web design, brand identity, motion, film marketing, and digital skills training. Built to convert, fully yours at handoff. Based in Abuja, serving Nigeria and the diaspora.',
  keywords: ['web design', 'web development', 'brand identity', 'Abuja', 'dako.studio', 'Nigeria web design', 'diaspora business websites'],
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
