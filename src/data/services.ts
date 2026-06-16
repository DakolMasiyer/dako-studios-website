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

export const services: Service[] = [
  {
    id: 'labs',
    title: 'Web Design & Development',
    subtitle: 'Labs',
    description: 'Premium websites for law firms, clinics, and professional services. Built fast, built right.',
    badge: 'Featured',
    badgeVariant: 'featured',
    href: '/labs',
    isClickable: true,
  },
  {
    id: 'brand',
    title: 'Branding & Digital Marketing',
    subtitle: 'Brand',
    description: 'Visual identity, social strategy, and campaigns that turn attention into revenue.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'motion',
    title: 'Motion Design & Video',
    subtitle: 'Motion',
    description: 'Short-form ads and brand films for product launches and social storytelling.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'film',
    title: 'Film Marketing & BTS',
    subtitle: 'Film',
    description: 'Poster design, BTS content, press kits, and premiere assets for productions.',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
    isClickable: false,
  },
  {
    id: 'academy',
    title: 'Digital Skills Bootcamp',
    subtitle: 'Academy',
    description: 'Hands-on web development training. From zero to deployed in 21 days.',
    badge: 'academy.dako.studio',
    badgeVariant: 'default',
    href: 'https://academy.dako.studio',
    isClickable: true,
  },
]
