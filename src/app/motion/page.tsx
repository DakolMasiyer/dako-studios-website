import type { Metadata } from 'next'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DotPattern } from '@/components/dot-pattern'
import {
  Check,
  Clapperboard,
  Shapes,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { portfolioItems, PortfolioItem } from '@/data/portfolio'
import { PortfolioCardVisual } from '@/components/portfolio-card-visual'

export const metadata: Metadata = {
  title: 'Dako Motion | Brand Animation & Product Video — Built to Convert',
  description: 'Logo animation, product films, and motion graphics that drive decisions. We move your brand with the precision of a film studio and the intent of a growth team.',
}

const motionPortfolioItems: PortfolioItem[] = portfolioItems.filter((item) => item.arm === 'motion')

const serviceItems = [
  {
    title: 'Brand Motion & Logo Animation',
    icon: Sparkles,
    desc: 'Identity that moves as confidently as it sits. Logo reveals, brand system animation, and motion guidelines that keep your brand consistent across every screen and platform.',
  },
  {
    title: 'Product & Commercial Video',
    icon: Clapperboard,
    desc: 'Cinematic product films built around one goal: making someone want what you\'re selling. From macro close-ups to full commercials, every frame earns its place.',
  },
  {
    title: 'Motion Graphics & Explainer',
    icon: Shapes,
    desc: 'Complex ideas made watchable. 2D and 3D motion graphics that turn your value proposition into something people actually finish — and remember.',
  },
]

const processSteps = [
  {
    num: '01',
    title: 'Brief',
    time: 'Day 0',
    desc: '20 minutes. We align on your goal, output format, and creative direction. You know exactly what you\'re getting before we start.',
  },
  {
    num: '02',
    title: 'Storyboard',
    time: 'Days 1 to 2',
    desc: 'We present a visual storyboard and reference reel. Nothing goes into production until you\'ve signed off on the direction. No surprises downstream.',
  },
  {
    num: '03',
    title: 'Production',
    time: 'Days 3 to 5',
    desc: 'Full animation and video production. Your storyboard approval is baked in from day one. We build, you review, we refine.',
  },
  {
    num: '04',
    title: 'Delivery',
    time: 'Days 5 to 7',
    desc: 'Final files in every format you need — MP4, MOV, social cuts. You own the masters outright. No licensing, no recurring fees.',
  },
]

const pricingPlans = [
  {
    name: 'Motion Starter',
    price: '$600',
    deliveryTime: '5-day turnaround',
    description: 'A single, polished motion piece. Right for brands that need a logo animation or one standout social asset to bring the identity to life.',
    isPopular: false,
    features: [
      'Logo animation (3–5 seconds)',
      'Storyboard approval before production',
      '2 revision rounds',
      'MP4 + MOV delivery',
      'All source files included',
    ],
  },
  {
    name: 'Brand Motion',
    price: '$1,800',
    deliveryTime: '7-day turnaround',
    description: 'A complete brand motion identity. Logo animation plus two to three branded scenes — built for social, in-app, and campaign use across every format.',
    isPopular: true,
    features: [
      'Logo animation + 2–3 branded scenes',
      'Social format cuts (Reels, Stories, 16:9)',
      'Storyboard + reference reel',
      '3 revision rounds',
      'Brand motion guidelines',
      'All file formats + masters',
    ],
  },
  {
    name: 'Full Production',
    price: 'From $3,500',
    deliveryTime: 'Custom timeline',
    description: 'Commercial product video or explainer built to brief. For brands that need a complete production — concept, storyboard, music, and final delivery in all formats.',
    isPopular: false,
    features: [
      'Full concept development',
      'Storyboard + animatic for approval',
      'Complete animation or video production',
      'Licensed music and sound design',
      'All platform cuts and formats',
      'Unlimited revisions within scope',
    ],
  },
]

const faqItems = [
  {
    question: 'What file formats do you deliver?',
    answer: 'Every project includes MP4 and MOV as standard. Depending on the package, you also receive social-ready cuts (1:1, 9:16, 16:9), transparent-background versions where applicable, and all source files. You get everything you need to deploy across every platform without coming back to us.',
  },
  {
    question: 'Do we own the music and sound design?',
    answer: 'All licensed music included in your project is cleared for commercial use with no ongoing fees. If you bring your own audio or commission original composition, we handle clearance as part of the project scope. The music is yours to use however you need it.',
  },
  {
    question: 'How many revision rounds are included?',
    answer: 'Motion Starter includes 2 rounds. Brand Motion includes 3. Full Production is unlimited within scope. In practice, because every project goes through a storyboard approval before production begins, revisions after that point are mostly refinements rather than directional changes.',
  },
  {
    question: 'Can you match our existing brand guidelines?',
    answer: 'Yes — and we prefer it that way. Send us your brand guidelines, colour palette, typefaces, and any existing assets before we start. Motion built to an existing system is always sharper than motion invented in isolation.',
  },
  {
    question: 'Do you work with existing footage, or is everything created from scratch?',
    answer: 'Both. We can build entirely from scratch using 2D or 3D motion graphics, incorporate product photography or existing video footage, or combine live asset integration with original animation. Tell us what you have in the brief and we\'ll design the production around it.',
  },
  {
    question: 'Can you produce social content as part of the project?',
    answer: 'Yes. Brand Motion and Full Production packages include social format cuts as standard. If you need a larger volume of social assets — platform-specific variations, story sequences, campaign sets — we can scope that into the brief at the start.',
  },
]

export default function MotionPage() {
  return (
    <div data-arm="motion" className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <LandingNavbar />

      <main>
        {/* Hero */}
        <section id="hero" className="relative overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28 border-b border-border/20">
          <div className="absolute inset-0 z-0">
            <DotPattern className="opacity-40" size="md" fadeStyle="ellipse" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 flex justify-center">
                <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase">
                  7-day delivery
                </Badge>
              </div>

              <h1 className="mb-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-none text-foreground">
                Your product<br />
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  deserves to move.
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed text-balance text-center">
                We create motion that doesn&apos;t just look good — it drives decisions. Brand identity animation, product films, and motion graphics built to convert.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16">
                <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-[4px] bg-primary px-8 text-base font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  Start a Project
                </Link>
                <a href="#portfolio" className="inline-flex h-12 items-center justify-center rounded-[4px] border border-border/40 bg-transparent px-8 text-base font-semibold shadow-sm transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  See Our Work
                </a>
              </div>

              {/* Trust Bar */}
              <div className="border-t border-border/20 py-6 mx-auto max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">7-Day</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Turnaround</span>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1 border-t md:border-t-0 md:border-l md:border-r border-border/20 pt-4 md:pt-0">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">200+</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Countries Reached</span>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1 border-t md:border-t-0 pt-4 md:pt-0">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">20+</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Projects Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                WHAT WE BUILD
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Motion for every<br />moment that matters.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Three disciplines. One intent: motion that earns attention and moves people toward a decision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {serviceItems.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <Card key={index} className="border border-border/20 bg-card hover:bg-muted transition-colors duration-200 rounded-[8px]">
                    <CardHeader className="space-y-4">
                      <div className="p-3 bg-primary/10 rounded-[4px] text-primary w-fit">
                        <IconComponent className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="font-display text-xl font-bold text-foreground tracking-tight">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">{service.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                WORK
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Brands we&apos;ve<br />put in motion.
              </h2>
              <div className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed space-y-4">
                <p>
                  A travel super-app distributed across 200 markets. A skincare brand that needed eight directed motion frames from macro freeze to logo lock. The brief is always different. The standard is not.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 sm:gap-y-16 max-w-6xl mx-auto">
              {motionPortfolioItems.map((item) => {
                const inner = (
                  <article>
                    <div className="overflow-hidden rounded-[8px] mb-5 border border-border/20">
                      <PortfolioCardVisual item={item} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-xs bg-muted/60 text-muted-foreground rounded-full font-medium border border-border/30">
                        {item.niche}
                      </span>
                      {item.category && item.category !== item.niche && (
                        <span className="px-3 py-1 text-xs bg-muted/60 text-muted-foreground rounded-full font-medium border border-border/30">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </article>
                )
                if (item.slug) {
                  return <Link key={item.id} href={`/case-studies/${item.slug}`} className="group block">{inner}</Link>
                }
                if (item.href && item.href !== '#') {
                  return <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
                }
                return <div key={item.id} className="group">{inner}</div>
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                PRICING
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                What you pay.<br />What you get.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-8">
                50% deposit to begin. Balance on delivery. Every package includes a storyboard approval before we go into production — you see the direction before it&apos;s built.
              </p>
              <Badge variant="outline" className="px-4 py-1.5 text-xs font-bold rounded-full border-primary/20 text-primary">
                All files and masters included at handoff
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {pricingPlans.map((plan, index) => {
                const cardStyle = plan.isPopular
                  ? 'bg-foreground text-background border-none shadow-2xl scale-105 z-10'
                  : 'bg-card text-foreground border-border/20'
                const textPriceStyle = plan.isPopular ? 'text-background' : 'text-foreground font-bold'
                const textDeliveryStyle = plan.isPopular ? 'text-primary font-bold' : 'text-primary/80 font-medium'
                const textDescStyle = plan.isPopular ? 'text-background/80' : 'text-muted-foreground'
                const textFeatureStyle = plan.isPopular ? 'text-background/90' : 'text-foreground/90'
                const btnStyle = plan.isPopular
                  ? 'bg-background text-foreground hover:bg-background/90 font-bold'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold'

                return (
                  <Card
                    key={index}
                    className={`border flex flex-col justify-between transition-all duration-300 relative rounded-[8px] p-7 ${cardStyle}`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-0.5 text-[11px] font-bold rounded-[4px] tracking-wider uppercase">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="p-0 space-y-2 pb-6">
                        <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{plan.name}</span>
                        <div className="flex items-baseline space-x-1">
                          <span className={`text-4xl sm:text-5xl font-display font-extrabold tracking-tight ${textPriceStyle}`}>{plan.price}</span>
                          {plan.price !== 'From $3,500' && <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">USD</span>}
                        </div>
                        <span className={`text-xs block mt-2 ${textDeliveryStyle}`}>{plan.deliveryTime}</span>
                        <p className={`text-sm pt-4 font-light leading-relaxed ${textDescStyle}`}>{plan.description}</p>
                      </div>

                      <div className="p-0 border-t border-border/10 pt-6">
                        <ul className="space-y-4">
                          {plan.features.map((feature, fIndex) => (
                            <li key={fIndex} className={`flex items-start space-x-3 text-sm font-light ${textFeatureStyle}`}>
                              <Check className="h-5 w-5 text-primary shrink-0" strokeWidth={2.5} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 mt-auto">
                      <Link href="/contact" className={`w-full inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${btnStyle}`}>
                        Start a Project
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Brief to final cut<br />in under 7 days.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Four steps. No vague timelines. Nothing goes into production until you&apos;ve approved the direction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
              {processSteps.map((step, index) => (
                <div key={index} className="relative flex flex-col justify-between h-full group">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-[70%] w-full h-[1px] bg-border/20 z-0" />
                  )}

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl font-bold font-display mb-6 group-hover:scale-105 transition-transform duration-300">
                      {step.num}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-bold font-display text-foreground tracking-tight">{step.title}</h4>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/25 rounded-md px-1.5 py-0 uppercase">
                        {step.time}
                      </Badge>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed pt-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 sm:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                QUESTIONS
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4 text-foreground leading-none">
                Things people ask<br />before we start.
              </h2>
            </div>

            <div className="max-w-3xl mx-auto border-t border-border/20 pt-4">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/20 py-2">
                    <AccordionTrigger className="text-base font-semibold text-foreground font-display hover:no-underline hover:text-primary transition-colors py-4 tracking-tight">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm font-light leading-relaxed text-muted-foreground pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
