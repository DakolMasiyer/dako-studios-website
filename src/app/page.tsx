import type { Metadata } from 'next'
import { LandingPageContent } from './landing/landing-page-content'

export const metadata: Metadata = {
  title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
  description: 'Five disciplines, one studio: web design, brand identity, motion, film marketing, and digital skills training. Built to convert, fully yours at handoff. Based in Abuja, serving Nigeria and the diaspora.',
  keywords: ['web design', 'web development', 'brand identity', 'Abuja', 'dako.studio', 'Nigeria web design', 'diaspora business websites'],
}

export default function HomePage() {
  return <LandingPageContent />
}
