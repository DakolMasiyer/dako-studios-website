import type { Metadata } from 'next'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { ContactSection } from '../landing/components/contact-section'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DotPattern } from '@/components/dot-pattern'
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Building, 
  Briefcase, 
  HeartPulse, 
  Utensils, 
  Landmark, 
  ArrowUpRight, 
  Globe 
} from 'lucide-react'
import { faqItems } from '@/data/faq'
import { pricingPlans, pricingTerms } from '@/data/pricing'
import { portfolioItems } from '@/data/portfolio'

export const metadata: Metadata = {
  title: 'Dako Labs | Premium Websites for Service Businesses',
  description: 'High-performance websites designed and built for real estate, law, healthcare, hospitality, and diaspora services. 5-7 day delivery, client-editable CMS.',
}

const nicheFocusItems = [
  {
    title: 'Real Estate & Property',
    icon: Building,
    desc: 'High-impact visual presentation of luxury listings, designed to capture buyer details and build trust instantly.'
  },
  {
    title: 'Law & Professional Services',
    icon: Briefcase,
    desc: 'Authoritative, clean layout to build immediate credibility, showcase partner achievements, and book client consultations.'
  },
  {
    title: 'Healthcare & Clinics',
    icon: HeartPulse,
    desc: 'Compassionate, compliant, and streamlined patient onboarding with clear booking flows and physician directories.'
  },
  {
    title: 'Hospitality & Restaurants',
    icon: Utensils,
    desc: 'Rich, mouthwatering imagery of menus, tables, and atmospheres, optimized for direct bookings and reservations.'
  },
  {
    title: 'Diaspora & International Services',
    icon: Landmark,
    desc: 'Bespoke digital platforms allowing international clients to explore, invest, and manage assets remotely.'
  }
]

const processSteps = [
  {
    num: '01',
    title: 'Discovery Call',
    time: 'Day 0',
    desc: 'A quick 15-minute call to align on your business goals, review design preferences, and map out the site structure.'
  },
  {
    num: '02',
    title: 'Design Preview',
    time: 'Day 1-2',
    desc: 'We create a live interactive preview using your brand details, so you can see and approve the design before the full build.'
  },
  {
    num: '03',
    title: 'Refine & Build',
    time: 'Day 3-5',
    desc: 'We gather your feedback, build out all required pages, write high-converting copy, and optimize performance.'
  },
  {
    num: '04',
    title: 'Launch & Handover',
    time: 'Day 5-7',
    desc: 'We go live on your domain and provide a custom screen recording walkthrough of your new client-editable CMS.'
  }
]

export default function LabsPage() {
  return (
    <div data-arm="labs" className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28 border-b border-border/20">
          <div className="absolute inset-0 z-0">
            <DotPattern className="opacity-40" size="md" fadeStyle="ellipse" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 flex justify-center">
                <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase">
                  Now accepting projects for Q3 2026
                </Badge>
              </div>
              
              <h1 className="mb-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-none text-foreground">
                Your website should work<br />as hard as <span className="text-primary">you do.</span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed">
                We design and build premium websites for law firms, clinics, real estate agencies, and professional services — delivered in days, not months. Based in Abuja, serving clients worldwide.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-16">
                <a href="#pricing" className="inline-flex h-12 items-center justify-center rounded-[4px] bg-primary px-8 text-base font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  See Pricing →
                </a>
                <a href="#portfolio" className="inline-flex h-12 items-center justify-center rounded-[4px] border border-border/40 bg-transparent px-8 text-base font-semibold shadow-sm transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  View Work
                </a>
              </div>

              {/* Stats / Trust Bar */}
              <div className="border-t border-border/20 py-6 mx-auto max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">5–7</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Day Delivery</span>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1 border-t md:border-t-0 md:border-l md:border-r border-border/20 pt-4 md:pt-0">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">100%</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mobile-First</span>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-1 border-t md:border-t-0 pt-4 md:pt-0">
                    <span className="font-display text-3xl font-extrabold text-foreground tracking-tight">CMS</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Client-Editable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Niche Focus Section */}
        <section id="services" className="py-24 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                Services
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Everything your brand<br />needs to win online.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                We design with your specific industry parameters in mind. No generic templates, just high-converting structures built for your niche.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-center">
              {nicheFocusItems.map((niche, index) => {
                const IconComponent = niche.icon
                return (
                  <Card key={index} className="border border-border/20 bg-card hover:bg-muted transition-colors duration-200 rounded-[8px]">
                    <CardHeader className="space-y-4">
                      <div className="p-3 bg-primary/10 rounded-[4px] text-primary w-fit">
                        <IconComponent className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="font-display text-xl font-bold text-foreground tracking-tight">{niche.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed">{niche.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                Portfolio
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Recent work.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Take a look at how we deploy high-fidelity concept design frameworks specifically for your line of work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {portfolioItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border border-border/20 bg-card hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group rounded-[8px]">
                  <CardContent className="p-0 flex-1 flex flex-col justify-between">
                    {/* Visual Browser Mockup */}
                    <div className="aspect-video bg-gradient-to-br from-primary/5 via-[#1E1E21] to-[#252528] relative flex items-center justify-center overflow-hidden border-b border-border/40 p-4">
                      <div className="absolute top-2 left-3 flex space-x-1.5 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
                      </div>
                      
                      <div className="w-4/5 h-[80%] mt-6 rounded-[4px] bg-card/40 border border-border/40 shadow-lg p-3 flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.03]">
                        <div className="flex justify-between items-center border-b border-border/20 pb-2">
                          <div className="w-12 h-3 rounded bg-primary/20"></div>
                          <div className="flex space-x-2">
                            <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
                            <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
                          </div>
                        </div>
                        <div className="space-y-2 py-2 flex-1">
                          <div className="w-3/4 h-4 rounded bg-foreground/10"></div>
                          <div className="w-full h-3 rounded bg-muted-foreground/10"></div>
                        </div>
                        <div className="flex justify-start">
                          <div className="w-16 h-5 rounded bg-primary/80"></div>
                        </div>
                      </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-primary text-xs font-semibold tracking-wider uppercase block">
                          {item.niche}
                        </span>
                        <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                        <Badge variant="outline" className="border-border/40 text-muted-foreground font-normal text-xs rounded-full">
                          {item.category}
                        </Badge>
                        <a href={item.href} className="inline-flex items-center text-primary hover:text-primary/90 text-sm font-semibold group-hover:underline cursor-pointer">
                          <Globe className="h-4 w-4 mr-1.5" strokeWidth={1.5} />
                          View concept
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                Pricing
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Transparent pricing.<br />No surprises.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-8">
                50% deposit to start. Balance on delivery. All packages include hosting setup, domain connection, and a handover walkthrough.
              </p>
              <Badge variant="outline" className="px-4 py-1.5 text-xs font-bold rounded-full border-primary/20 text-primary">
                {pricingTerms}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {pricingPlans.map((plan, index) => {
                const cardStyle = plan.isPopular
                  ? 'bg-foreground text-background border-none shadow-2xl scale-105 z-10'
                  : 'bg-card text-foreground border-border/20'

                const textTitleStyle = plan.isPopular ? 'text-background' : 'text-foreground font-bold'
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
                      <CardHeader className="p-0 space-y-2 pb-6">
                        <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{plan.name}</span>
                        <div className="flex items-baseline space-x-1">
                          <span className={`text-4xl sm:text-5xl font-display font-extrabold tracking-tight ${textPriceStyle}`}>{plan.price}</span>
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1">USD</span>
                        </div>
                        <span className={`text-xs block mt-2 ${textDeliveryStyle}`}>{plan.deliveryTime}</span>
                        <p className={`text-sm pt-4 font-light leading-relaxed ${textDescStyle}`}>{plan.description}</p>
                      </CardHeader>
                      
                      <CardContent className="p-0 border-t border-border/10 pt-6">
                        <ul className="space-y-4">
                          {plan.features.map((feature, fIndex) => (
                            <li key={fIndex} className={`flex items-start space-x-3 text-sm font-light ${textFeatureStyle}`}>
                              <Check className="h-5 w-5 text-primary shrink-0" strokeWidth={2.5} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>
                    
                    <div className="pt-8 mt-auto">
                      <a href="#contact" className={`w-full inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${btnStyle}`}>
                        {plan.isPopular ? 'Most Popular' : 'Get Started'}
                      </a>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-24 sm:py-32 bg-background border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-20">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                Methodology
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-6 text-foreground leading-none">
                Brief to live<br />in under 7 days.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                We deliver fast, premium results through a collaborative and disciplined build methodology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
              {processSteps.map((step, index) => (
                <div key={index} className="relative flex flex-col justify-between h-full group">
                  {/* Step Number Line connector */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-[70%] w-full h-[1px] bg-border/20 z-0"></div>
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

        {/* FAQ Section */}
        <section id="faq" className="py-24 sm:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
                Questions
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4 text-foreground leading-none">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
                Everything you need to know about working with Dako Labs.
              </p>
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

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
