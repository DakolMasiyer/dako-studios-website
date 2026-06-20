export interface NavItem {
  name: string
  href: string
  isExternal?: boolean
}

export interface SiteConfig {
  name: string
  domain: string
  description: string
  tagline: string
  socials: {
    twitter?: string
    instagram?: string
    linkedin?: string
    behance?: string
  }
  contact: {
    email: string
    whatsapp: string
    address: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'Dako Studios',
  domain: 'dako.studio',
  description: 'Five disciplines. Zero compromises.',
  tagline: 'We build digital presences that convert — web design, brand identity, motion, film, and skills training. All under one roof.',
  socials: {
    // Only confirmed, live accounts go here — placeholders stay commented out
    // until the real handles exist, so we never link to a dead profile.
    instagram: 'https://instagram.com/dakostudioshq',
  },
  contact: {
    email: 'hello@dako.studio',
    whatsapp: 'https://wa.me/2347070609297',
    address: 'Abuja, Nigeria',
  },
}

export const rootNavItems: NavItem[] = [
  { name: 'Work', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export const labsNavItems: NavItem[] = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '/case-studies' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '/contact' },
  { name: 'Studio Hub', href: '/' },
]

export const motionNavItems: NavItem[] = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#portfolio' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '/contact' },
  { name: 'Studio Hub', href: '/' },
]
