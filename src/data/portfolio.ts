export interface PortfolioItem {
  id: string
  title: string
  niche: string
  description: string
  image: string // local path or placeholder
  href: string
  category: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'property-showcase',
    title: 'Property Showcase',
    niche: 'Real Estate & Property',
    description: 'A premium visual platform for displaying luxury listings, virtual tours, and capturing high-intent buyer leads.',
    image: '/images/portfolio/real-estate.jpg',
    href: '#',
    category: 'Real Estate',
  },
  {
    id: 'legal-practice',
    title: 'Legal Practice',
    niche: 'Law & Professional Services',
    description: 'A clean, authoritative website designed to showcase partner bios, practice areas, and book high-value consultations.',
    image: '/images/portfolio/law.jpg',
    href: '#',
    category: 'Law',
  },
  {
    id: 'wellness-clinic',
    title: 'Wellness Clinic',
    niche: 'Healthcare & Clinics',
    description: 'An elegant patient portal integrating online scheduling, physician profiles, and service listings.',
    image: '/images/portfolio/healthcare.jpg',
    href: '#',
    category: 'Healthcare',
  },
  {
    id: 'the-grand-table',
    title: 'The Grand Table',
    niche: 'Hospitality & Restaurants',
    description: 'A rich visual layout highlighting dining menus, online reservation links, and hosting services.',
    image: '/images/portfolio/hospitality.jpg',
    href: '#',
    category: 'Hospitality',
  },
  {
    id: 'homebase-africa',
    title: 'HomeBase Africa',
    niche: 'Diaspora & International Services',
    description: 'A digital bridge offering specialized remote management and investment services for diaspora clients.',
    image: '/images/portfolio/diaspora.jpg',
    href: '#',
    category: 'Diaspora Services',
  },
]
