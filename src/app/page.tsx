import type { Metadata } from 'next'
import { LandingPageContent } from './landing/landing-page-content'

export const metadata: Metadata = {
  title: 'Dako Studios | Web Design, Brand, Motion & Film — Built to Convert',
  description: 'Dako Studios builds websites and brand assets that actually convert — and hands you full ownership at launch. No retainer. Web design, brand identity, motion, and film marketing.',
  keywords: ['web design', 'web development', 'brand identity', 'dako.studio', 'Nigeria web design', 'creative studio'],
}

export default function HomePage() {
  return <LandingPageContent />
}
