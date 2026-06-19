"use client"

import { MessageSquare, FileText, Layers, PackageCheck } from 'lucide-react'

const phases = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Discovery',
    timing: 'Day 0',
    description:
      'A free 30-minute call — no pitch deck, no pressure. We ask about your goals, timeline, and budget. You ask whatever you need. If we are the right fit, we say so. If not, we say that too.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Brief & scope',
    timing: 'Days 1–2',
    description:
      'We send a structured brief to capture your requirements, references, and objectives. You get a fixed price and a committed timeline. Everything agreed before a single pixel moves.',
  },
  {
    number: '03',
    icon: Layers,
    title: 'Build & review',
    timing: 'Days 2–12',
    description:
      'Design, develop, produce — depending on the arm. You get checkpoints and one to three feedback rounds. No radio silence. We move fast and keep you in the loop at every stage.',
  },
  {
    number: '04',
    icon: PackageCheck,
    title: 'Handoff',
    timing: 'Days 7–14',
    description:
      'Every file, credential, and asset transfers to you with a walkthrough guide. You own everything outright. We stay available for questions — but you will not need us to keep the lights on.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground leading-none mb-6">
            From brief to live in four steps.
          </h2>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto">
            The same four phases run across every arm — web, brand, motion, and film. No surprises, no scope creep, no lingering dependencies.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line — desktop only */}
          <div
            className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[26px] h-px bg-border/50 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon
              return (
                <div key={index} className="flex flex-col items-center text-center lg:px-2">
                  {/* Icon ring — bg-background masks the connecting line */}
                  <div className="relative mb-6 z-10">
                    <div className="w-[52px] h-[52px] rounded-full bg-background flex items-center justify-center">
                      <div className="w-[44px] h-[44px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="size-5 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                    <span className="absolute -top-1.5 -right-2.5 font-mono text-[10px] font-bold text-primary/50 tracking-wider select-none">
                      {phase.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground block">
                      {phase.timing}
                    </span>
                    <h3 className="font-display font-bold text-foreground text-lg tracking-tight">
                      {phase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {phase.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Applies-to note */}
        <p className="text-center text-xs text-muted-foreground/70 mt-16 max-w-lg mx-auto tracking-wide">
          Applies to Labs, Brand, Motion, and Film. Timelines are fixed at brief and vary by arm and scope.
        </p>
      </div>
    </section>
  )
}
