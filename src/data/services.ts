export interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'featured'
  href?: string
  isClickable: boolean
}

export interface ArmService {
  name: string
  description: string
}

export const services: Service[] = [
  {
    id: 'labs',
    title: 'Web Design & Development',
    subtitle: 'Labs',
    description: 'Websites built to convert — live in 5–10 days, fully yours at handoff.',
    badge: 'Active',
    badgeVariant: 'featured',
    href: '/labs',
    isClickable: true,
  },
  {
    id: 'brand',
    title: 'Brand Identity & Systems',
    subtitle: 'Brand',
    description: 'Visual identity, brand systems, and the language your business speaks.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'motion',
    title: 'Motion & Video Production',
    subtitle: 'Motion',
    description: 'Product videos and social-first brand content that moves.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'film',
    title: 'Film Marketing & Promotions',
    subtitle: 'Film',
    description: 'End-to-end release marketing for film and music — from poster to premiere.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'academy',
    title: 'Digital Skills Bootcamp',
    subtitle: 'Academy',
    description: 'Hands-on web development training. From zero to deployed in 21 days.',
    badge: 'Active',
    badgeVariant: 'default',
    href: 'https://learn.dako.studio',
    isClickable: true,
  },
]

export const armServices: Record<string, ArmService[]> = {
  labs: [
    { name: 'Websites', description: 'Conversion-led builds, 5–10 day delivery.' },
    { name: 'Product Design', description: 'UI/UX for the sites we build.' },
    { name: 'No-Code Development', description: 'How fast builds actually ship.' },
  ],
  brand: [
    { name: 'Brand Identity & Logo Design', description: 'Visual identity from the ground up.' },
    { name: 'Brand Systems', description: 'Guidelines, voice, and visual language.' },
  ],
  motion: [
    { name: 'Product Videos', description: 'Explainers, app demos, ad creative.' },
    { name: 'Consumer & Brand Content', description: 'Social-first kinetic content, campaign cutdowns.' },
  ],
  film: [
    {
      name: 'Film Marketing & Promotions',
      description: 'Poster design, premiere coordination, digital promotion strategy, and PR for first features and emerging artists.',
    },
  ],
  academy: [
    { name: 'Days 1–3', description: 'Free foundations — open to everyone.' },
    { name: 'Days 4–20', description: 'Full-stack bootcamp — deployed in 21 days.' },
  ],
}
