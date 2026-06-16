import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Scale } from 'lucide-react'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { DotPattern } from '@/components/dot-pattern'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Terms of Service | Dako Studios',
  description: 'Terms of Service for Dako Studios Agency services and Dako Studios Academy.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <LandingNavbar />
      
      <main className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 flex-1">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <DotPattern className="opacity-30" size="md" fadeStyle="ellipse" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <div className="mb-10 max-w-3xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center text-xs font-mono tracking-[0.15em] text-muted-foreground/80 hover:text-primary uppercase transition-colors gap-2 group cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>
          
          <article className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="border-b border-border/20 pb-8 mb-12">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="h-4 w-4 text-primary" />
                <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-primary uppercase">
                  Legal Document
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-sm font-mono mt-4">
                Dako Studios · Effective: 20 June 2026 · Last Updated: 20 June 2026
              </p>
            </header>
            
            {/* Content body */}
            <div className="space-y-12 text-muted-foreground leading-relaxed font-light text-sm sm:text-base">
              
              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Overview
                </h2>
                <p className="mb-4">
                  These Terms of Service govern your use of Dako Studios&apos; services and platforms. By engaging us for creative work or enrolling in the Academy, you agree to these terms.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">&quot;Dako Studios&quot;, &quot;we&quot;, &quot;us&quot;</strong> refers to the studio operating at <Link href="/" className="text-primary hover:underline font-medium">dako.studio</Link> and <a href="https://learn.dako.studio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">learn.dako.studio</a>, based in Abuja, Nigeria.
                </p>
                <p className="mb-4">
                  <strong className="text-foreground">&quot;You&quot;</strong> means the client, student, or visitor engaging with our services.
                </p>
                <p className="font-mono text-xs text-muted-foreground/80 mt-4">
                  Questions: <a href="mailto:hello@dako.studio" className="text-primary hover:underline font-medium">hello@dako.studio</a>
                </p>
              </section>

              <Separator className="bg-border/10" />

              {/* Part A */}
              <section className="space-y-8">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block mb-1">PART A</span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                    Agency Services
                  </h2>
                  <p className="text-sm text-muted-foreground/60 italic font-mono mt-1">
                    (Labs, Brand, Motion, Film)
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A1. Scope of work
                    </h3>
                    <p className="mb-2">
                      All agency projects begin with a written brief or proposal outlining:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>Deliverables and what is included</li>
                      <li>Timeline and sprint structure</li>
                      <li>Pricing and payment schedule</li>
                      <li>Revision rounds included</li>
                    </ul>
                    <p>
                      Work outside the agreed scope — additional pages, new design directions, additional platforms — is quoted separately before work begins. We will not bill you for out-of-scope work without your written approval first.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A2. Payment
                    </h3>
                    <p className="mb-2">
                      <strong className="text-foreground">Deposit:</strong> All projects require a 50% deposit before work begins. The deposit is non-refundable once work has started.
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">Balance:</strong> The remaining 50% is due on or before the final delivery date stated in your proposal.
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">Late payment:</strong> Invoices unpaid 14 days after the due date may pause delivery until payment is received.
                    </p>
                    <p>
                      <strong className="text-foreground">Currency:</strong> Nigerian clients are invoiced in Naira (NGN) via Flutterwave or Paystack. International clients are invoiced in USD via Deel. The currency applicable to your project is stated in your proposal.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A3. Revisions
                    </h3>
                    <p className="mb-2">
                      Each project includes a fixed number of revision rounds stated in your proposal (typically two rounds for Labs projects).
                    </p>
                    <p className="mb-2">
                      A revision means changes to the agreed design direction — not a new design direction. If you change the brief after work has started, that is treated as a new scope item and quoted accordingly.
                    </p>
                    <p>
                      Revision requests must be submitted in writing (email or agreed project channel) as a consolidated list — not piecemeal over multiple messages.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A4. Timeline
                    </h3>
                    <p className="mb-2">
                      We operate on a fixed sprint model. Your project timeline is stated in your proposal and begins on the date your deposit clears.
                    </p>
                    <p className="mb-2">
                      Timeline extensions caused by delays on your side — late content delivery, slow feedback, missed review windows — extend the delivery date by the same number of days. We will notify you when this happens.
                    </p>
                    <p>
                      We do not charge for delays on our side. If we miss a milestone, we will communicate it early and give you an updated timeline.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A5. Content and materials
                    </h3>
                    <p className="mb-2">
                      You are responsible for providing all content needed for your project — copy, images, logos, brand assets — by the date specified in your brief. We can advise on content structure, but writing and sourcing content is not included unless explicitly stated in your proposal.
                    </p>
                    <p>
                      Any content you provide must be content you own or have the rights to use. You take responsibility for ensuring this.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A6. Ownership and handoff
                    </h3>
                    <p className="mb-2">
                      <strong className="text-foreground">Before final payment:</strong> All work in progress — designs, code, files — remains the property of Dako Studios.
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">After final payment:</strong> Full ownership of the final deliverables transfers to you. This includes the website build and all its files, brand identity assets (logo files, guidelines, etc.), and any other deliverables listed in your proposal.
                    </p>
                    <p className="mb-2">
                      We retain the right to display completed work in our portfolio unless you request otherwise in writing.
                    </p>
                    <p>
                      <strong className="text-foreground">Third-party tools and licenses:</strong> Some builds use third-party platforms (e.g. Framer, Webflow). You are responsible for maintaining your own subscription to these platforms after handoff. We will advise you on what is needed.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A7. Confidentiality
                    </h3>
                    <p>
                      We treat all client information, business details, and project materials as confidential. We do not share them with third parties except where necessary to deliver your project (e.g. hosting providers). We ask the same in return — our proposals, pricing, and process documents are confidential to you.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A8. Cancellations
                    </h3>
                    <p className="mb-2">
                      <strong className="text-foreground">Cancelled by you before work starts:</strong> Full deposit refunded minus any administrative costs already incurred.
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">Cancelled by you after work starts:</strong> The deposit is forfeited. If work has progressed beyond 50% of the agreed scope, a further partial payment may be due — calculated proportionally and agreed with you in writing before any additional charge is made.
                    </p>
                    <p>
                      <strong className="text-foreground">Cancelled by us:</strong> Full refund of any amounts paid. We will only cancel a project in exceptional circumstances and will give you as much notice as possible.
                    </p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 sm:p-8 my-6">
                    <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      A9. Liability &amp; Disclaimers
                    </h3>
                    <p className="mb-3">
                      Dako Studios is not liable for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 mb-4 text-sm sm:text-base">
                      <li>Loss of revenue, leads, or business opportunities arising from a website or campaign outcome</li>
                      <li>Third-party platform outages (Framer, Vercel, Cloudflare, Meta, etc.)</li>
                      <li>Content you provided that turns out to be inaccurate, infringing, or unsuitable</li>
                    </ul>
                    <p className="font-semibold text-foreground mb-3">
                      Our total liability for any claim related to a project is capped at the amount you paid us for that project.
                    </p>
                    <p className="text-sm">
                      We do not offer guarantees on specific business outcomes — ranking positions, lead volume, conversion rates, or revenue — as these depend on factors outside our control.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      A10. Disputes
                    </h3>
                    <p className="mb-2">
                      We prefer to resolve disputes directly and quickly. If something goes wrong, email <a href="mailto:hello@dako.studio" className="text-primary hover:underline font-medium">hello@dako.studio</a> first. We will respond within 3 business days.
                    </p>
                    <p>
                      These terms are governed by the laws of the Federal Republic of Nigeria. Any unresolved dispute will be referred to arbitration in Abuja under Nigerian law before any court proceedings are initiated.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="bg-border/10" />

              {/* Part B */}
              <section className="space-y-8">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block mb-1">PART B</span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                    Academy
                  </h2>
                  <p className="text-sm text-muted-foreground/60 italic font-mono mt-1">
                    (learn.dako.studio)
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B1. Enrollment
                    </h3>
                    <p className="mb-2">
                      Enrollment is confirmed when:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>You have completed registration on learn.dako.studio</li>
                      <li>Your enrollment fee (where applicable) has been paid and confirmed</li>
                    </ul>
                    <p>
                      Free-tier access (where offered) is confirmed on registration only.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B2. Access
                    </h3>
                    <p className="mb-2">
                      Once enrolled, you have access to your cohort&apos;s curriculum for the duration of the course plus 30 days after the final session. Extended access beyond this window is not guaranteed.
                    </p>
                    <p>
                      Access is personal and non-transferable. You may not share your login credentials or course materials with anyone else.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B3. Payment and refunds (Academy)
                    </h3>
                    <p className="mb-2">
                      <strong className="text-foreground">Paid enrollment:</strong> Full payment is due before or at enrollment.
                    </p>
                    <p className="mb-2">
                      <strong className="text-foreground">Refund window:</strong> You may request a full refund within 48 hours of enrollment, provided you have not accessed more than the first lesson. After 48 hours or after accessing beyond Lesson 1, no refund is issued.
                    </p>
                    <p>
                      <strong className="text-foreground">Scholarship and free-tier places:</strong> Non-refundable (no payment was made).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B4. Student conduct
                    </h3>
                    <p className="mb-2">
                      The Academy is a learning environment. You agree to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 mb-2">
                      <li>Engage with the material honestly — submit your own work, not work generated entirely by AI tools on your behalf without engagement</li>
                      <li>Treat coaches and fellow students with respect in any shared spaces</li>
                      <li>Not reproduce or distribute course materials outside the platform</li>
                    </ul>
                    <p>
                      We reserve the right to remove a student from the cohort — without refund — for serious violations of these conduct expectations.
                    </p>
                  </div>

                  <div className="bg-card border border-border/20 rounded-xl p-6 sm:p-8 my-6">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                      B5. Certificates and credentials
                    </h3>
                    <p className="mb-3">
                      Completion certificates are issued to students who:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-4 text-sm sm:text-base">
                      <li>Complete all daily missions within the cohort window (or an agreed extension)</li>
                      <li>Submit a satisfactory Day 20 capstone project</li>
                    </ul>
                    <p className="text-sm italic text-muted-foreground">
                      *Note: Certificates reflect completion of the Dako Studios Academy curriculum. They are not accredited by a Nigerian or international regulatory body at this time. We will update this clause if accreditation is obtained.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B6. Course content
                    </h3>
                    <p className="mb-2">
                      All Academy curriculum — lessons, guides, templates, and mission briefs — is the intellectual property of Dako Studios. You may use what you learn freely in your own work. You may not reproduce, resell, or redistribute the course materials themselves.
                    </p>
                    <p>
                      We may update course content between cohorts to keep it current. Enrolled students receive the version active at the time of their cohort.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      B7. Coaches and support
                    </h3>
                    <p>
                      Academy coaching is provided by Dako Studios staff or contracted coaches. Response times for coach feedback are stated in your cohort welcome materials. We do not guarantee real-time support outside stated hours.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="bg-border/10" />

              {/* Part C */}
              <section className="space-y-8">
                <div className="border-l-2 border-primary pl-4 py-1">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider block mb-1">PART C</span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                    General Terms
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      C1. Changes to these terms
                    </h3>
                    <p>
                      We may update these terms as the studio grows. If we make material changes, we will notify active clients and enrolled students by email and update the effective date at the top of this page. Continued use of our services after a change means you accept the updated terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      C2. Governing law
                    </h3>
                    <p>
                      These terms are governed by the laws of the Federal Republic of Nigeria, including the Nigeria Data Protection Regulation (NDPR) where personal data is involved.
                    </p>
                  </div>

                  <div className="bg-card border border-border/20 rounded-xl p-6 sm:p-8">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      C3. Contact
                    </h3>
                    <p className="mb-4 text-sm">
                      For any questions about these terms:
                    </p>
                    <div className="font-mono text-xs space-y-1 text-muted-foreground/90">
                      <p><span className="text-foreground">Email:</span> <a href="mailto:hello@dako.studio" className="text-primary hover:underline">hello@dako.studio</a></p>
                      <p><span className="text-foreground">Studio:</span> Dako Studios, Abuja, Nigeria</p>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </article>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  )
}
