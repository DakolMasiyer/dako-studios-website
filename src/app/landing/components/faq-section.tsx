"use client"

import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type FaqItem = {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'After handoff, can I still update my website myself?',
    answer:
      'Yes — full editing access is part of every project. We build on platforms and stacks you can maintain without depending on us. Every handoff includes a guide so you know exactly how to make changes. If you want ongoing support beyond that, we offer it, but it is never a requirement.',
  },
  {
    value: 'item-2',
    question: 'What actually happens after I reach out?',
    answer:
      'We start with a free 30-minute discovery call — no pitch, just a conversation about what you need and whether we are the right fit. If we move forward, we send a brief to capture your requirements, then scope the project with a fixed price and timeline. From there it is design, build, one or two rounds of feedback, and handoff. Most web projects move from brief to live in under two weeks.',
  },
  {
    value: 'item-3',
    question: 'Why work with a studio instead of a freelancer or in-house designer?',
    answer:
      'A freelancer gives you one set of hands — when it comes to a site that also needs copy, motion, or brand thinking, you end up coordinating multiple people yourself. We bring design, development, and strategy under one roof with a defined process. You deal with one point of contact, not five. For fast-moving businesses that need to ship and move on, that matters.',
  },
  {
    value: 'item-4',
    question: 'Does the project include any free marketing or promotions?',
    answer:
      'Our build packages are scoped to design and development. That said, we do not just hand over code and disappear — every web project includes launch support and guidance on getting early traction. If you need broader ongoing marketing, our Brand arm handles that as a separate engagement.',
  },
  {
    value: 'item-5',
    question: 'If I commission a film, will people actually see it?',
    answer:
      "Production without distribution is a waste of budget, and we're aware of that. Our Film arm includes strategy conversations around getting eyeballs — platforms, press angles, and campaign framing. We help you think through visibility from the start, not as an afterthought.",
  },
  {
    value: 'item-6',
    question: 'How fast can you actually turn around a website?',
    answer:
      'Standard builds ship in 7–10 days. Complex projects with custom functionality or larger page counts can run up to 14 days. We scope honestly at discovery so there are no surprises on either side.',
  },
  {
    value: 'item-7',
    question: 'Do you work with businesses outside Nigeria?',
    answer:
      'Yes. We are based in Abuja and most of our clients are Nigerian businesses, but we work regularly with diaspora founders and international companies that want a studio that understands the African market. All projects are handled remotely — discovery calls, briefs, feedback, and handoff all happen async or over video.',
  },
  {
    value: 'item-8',
    question: 'Do I own everything you build?',
    answer:
      'Completely. No licensing fees, no platform lock-in, no ongoing payments to us to keep your site live. When we hand off, you own the design, the code, and the content outright. That is non-negotiable for us.',
  },
]

const FaqSection = () => {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground leading-none mb-6">
            Questions we actually get.
          </h2>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
            Straight answers to what prospects ask us most before signing.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map(item => (
              <AccordionItem key={item.value} value={item.value} className="rounded-[8px] border border-border/20 bg-card">
                <AccordionTrigger className="cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b border-border/20">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                      <CircleHelp className="size-5" />
                    </div>
                    <span className="text-start font-semibold text-foreground">{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4 text-sm">
              Something not covered here?
            </p>
            <Button className="cursor-pointer rounded-[4px]" asChild>
              <a href="/contact">Ask us directly</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FaqSection }
