"use client"

import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Essential',
    range: '$1,000 – $1,500',
    description: 'A clean, conversion-focused site for businesses ready to show up online.',
    features: [
      'Up to 5 pages',
      'Mobile-responsive design',
      'Contact form integration',
      '7-day delivery',
      '1 revision round',
      'Full ownership at handoff',
      'Basic SEO setup',
    ],
    cta: 'Get a Quote',
    highlighted: false,
  },
  {
    name: 'Growth',
    range: '$2,000 – $2,500',
    description: 'For businesses that need more pages, more polish, and a site that works harder.',
    features: [
      'Up to 10 pages',
      'Custom animations & interactions',
      'CMS integration',
      '10-day delivery',
      '2 revision rounds',
      'Full ownership at handoff',
      'SEO-optimised structure',
      'Launch-day support',
    ],
    cta: 'Get a Quote',
    highlighted: true,
    badge: 'Most Chosen',
  },
  {
    name: 'Premium',
    range: 'From $3,500',
    description: 'Complex builds — e-commerce, booking systems, portals, and custom architecture.',
    features: [
      'Unlimited pages',
      'Advanced functionality',
      'Custom design system',
      'Up to 14-day delivery',
      '3 revision rounds',
      'Full ownership at handoff',
      'Post-launch support window',
      'Priority client access',
    ],
    cta: 'Let\'s Talk Scope',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Labs Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground leading-none mb-6">
            Transparent from the start.
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
            Project-based pricing — no retainers, no hidden fees. You own everything we build.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-[8px] border p-8 flex flex-col gap-6 ${
                plan.highlighted
                  ? 'border-primary/30 bg-primary/5 shadow-xl shadow-primary/5'
                  : 'border-border/20 bg-card'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-8 text-xs font-bold tracking-[0.15em] uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Plan header */}
              <div>
                <p className="font-semibold text-foreground mb-1">{plan.name}</p>
                <p className="text-3xl font-display font-extrabold text-foreground tracking-tight">{plan.range}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full cursor-pointer rounded-[4px]"
              >
                <a href="/contact">
                  {plan.cta}
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Not sure which tier fits? <a href="/contact" className="text-foreground font-medium underline underline-offset-4 hover:text-primary transition-colors">Book a free discovery call</a> — we&apos;ll scope it together.
        </p>
      </div>
    </section>
  )
}
