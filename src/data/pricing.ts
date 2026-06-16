export interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  deliveryTime: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$1,500',
    description: 'Perfect for establishing your business online with a premium, high-impact presence.',
    features: [
      '5-page responsive website',
      'Mobile-first layout design',
      'Contact form integration',
      'Basic SEO optimization',
      '1 round of revisions',
    ],
    deliveryTime: '5-day delivery',
  },
  {
    name: 'Business',
    price: '$2,500',
    description: 'Our most popular package. Designed for growing businesses that require regular updates and integrations.',
    features: [
      'Up to 10 custom pages',
      'Client-editable CMS',
      'Booking & calendar integration',
      'SEO + Google Analytics',
      'Social media integration',
      '2 rounds of revisions',
    ],
    isPopular: true,
    deliveryTime: '7-day delivery',
  },
  {
    name: 'Premium',
    price: '$3,500',
    description: 'The complete digital package. High-fidelity visuals combined with marketing video and dedicated support.',
    features: [
      'Everything in Business package',
      '30-second custom brand video',
      'Advanced custom animations',
      'Speed & performance optimization',
      '3 rounds of revisions',
      '30 days post-launch support',
    ],
    deliveryTime: '10-day delivery',
  },
]

export const pricingTerms = '50% deposit to start. Balance on delivery.'
