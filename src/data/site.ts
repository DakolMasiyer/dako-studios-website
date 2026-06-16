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
    twitter: string
    instagram: string
    linkedin: string
    behance: string
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
    twitter: 'https://twitter.com/dakostudios',
    instagram: 'https://instagram.com/dakostudios',
    linkedin: 'https://linkedin.com/company/dako-studios',
    behance: 'https://behance.net/dakostudios',
  },
  contact: {
    email: 'hello@dako.studio',
    whatsapp: 'https://wa.me/2348000000000',
    address: 'Abuja, Nigeria',
  },
}

export const rootNavItems: NavItem[] = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
  { name: 'Labs', href: '/labs' },
  { name: 'Academy', href: 'https://learn.dako.studio', isExternal: true },
]

export const labsNavItems: NavItem[] = [
  { name: 'Services', href: '#services' },
  { name: 'Work', href: '#portfolio' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
  { name: 'Studio Hub', href: '/' },
]
