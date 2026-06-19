"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type Testimonial = {
  name: string
  role: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Steve Gukas',
    role: 'MD & Director, Native Filmworks',
    quote:
      'What stood out with Dako Studios is the rare combination of precision and range. Every layer of the project was handled with genuine attention to detail — and they moved across disciplines without losing quality at any point. That kind of multifaceted capability is exactly what a production company needs in a creative partner.',
  },
  {
    name: 'Nono Bukiti',
    role: 'Transformation Leader, Data Sentinels',
    quote:
      "The work ethic at Dako Studios is the kind you don't often encounter. They stay committed from brief to handoff — no corners cut, no excuses. That consistency is what builds real trust in a creative partner.",
  },
  {
    name: 'David',
    role: 'CEO, Amnik Enterprise',
    quote:
      'Dako Studios delivered on every front. Professional, thorough, and the results spoke for themselves. Exactly what we needed.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Client Voices
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground leading-none">
            What clients say.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border/20 bg-card shadow-none rounded-[8px]">
              <CardContent className="p-6 flex flex-col h-full">
                <blockquote className="flex-1 mb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm text-balance">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                <div className="flex items-center gap-3">
                  <Avatar className="size-10 bg-primary/10 shrink-0">
                    <AvatarFallback className="text-primary font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
