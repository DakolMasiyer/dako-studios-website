export interface PortfolioItem {
  id: string
  title: string
  niche: string
  description: string
  image: string // local path or placeholder
  href: string
  category: string
  arm?: string // labs | brand | motion | film | academy
  slug?: string // case-studies/[slug] route segment, when a detail page exists
  featured?: boolean
  coverImage?: string // wide background source for the card visual
  coverImageMobile?: string // phone-frame source for the card visual
  video?: string // autoplay motion reel for video cards
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'daanong-gyang',
    title: "Da'anong Gyang — Director of Photography",
    niche: 'Creative Professional',
    description: 'Portfolio site for an ARRI-certified cinematographer with Amazon Prime, M-Net, and Showmax credits — built so the right people could find and verify his work fast. More bookings followed launch.',
    image: '/images/portfolio/daanong-gyang.jpg',
    href: 'https://dwain-gyang-dp.netlify.app/',
    category: 'Film/Creative',
    arm: 'labs',
    featured: true,
    coverImage: '/images/portfolio/daanong-gyang-cover.jpg',
    coverImageMobile: '/images/portfolio/daanong-gyang-cover-mobile.jpg',
  },
  {
    id: 'avm-paul-masiyer',
    title: 'AVM Paul Masiyer',
    niche: 'Political Campaign',
    description: 'A campaign site built to establish credibility and communicate platform fast, under real-world deadline pressure.',
    image: '/images/portfolio/avm-paul-masiyer.jpg',
    href: '#',
    category: 'Campaign',
    arm: 'labs',
  },
  {
    id: 'chief-mike-ejiogu',
    title: 'Chief Mike Ejiogu',
    niche: 'Political Campaign',
    description: 'Same brief, same pressure, same turnaround — a second campaign site proving the process repeats.',
    image: '/images/portfolio/chief-mike-ejiogu.jpg',
    href: '#',
    category: 'Campaign',
    arm: 'labs',
  },
  {
    id: 'getly-motion',
    title: 'Getly',
    niche: 'Brand Motion Identity',
    description: 'Logo animation and brand video for Getly — a fintech super-app connecting travellers to eSIM, payments, and local discovery across 200+ countries.',
    image: '/images/portfolio/getly-poster.jpg',
    video: '/videos/getly-motion.mp4',
    href: '#',
    category: 'Motion Design',
    arm: 'motion',
    slug: 'getly-motion-brand-video',
  },
  {
    id: 'faceserum-motion',
    title: 'Acwell Face Serum',
    niche: 'Product Motion Video',
    description: 'Cinematic product video for ACWELL Licorice pH Balancing Cleansing Toner — eight motion frames from macro freeze to logo lock.',
    image: '/images/portfolio/faceserum-poster.jpg',
    video: '/videos/faceserum-motion.mp4',
    href: '#',
    category: 'Motion Design',
    arm: 'motion',
    slug: 'acwell-faceserum-product-motion',
  },
]
