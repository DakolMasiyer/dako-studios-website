import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'
import { DotPattern } from '@/components/dot-pattern'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Privacy Policy | Dako Studios',
  description: 'Privacy Policy for Dako Studios Agency and Dako Studios Academy. Learn how we collect, use, and protect your personal data under the NDPR.',
}

export default function PrivacyPolicyPage() {
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
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-mono text-[11px] font-bold tracking-[0.15em] text-primary uppercase">
                  Legal Document
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-sm font-mono mt-4">
                Dako Studios · Effective: 20 June 2026 · Last Updated: 20 June 2026
              </p>
            </header>
            
            {/* Content body */}
            <div className="space-y-10 text-muted-foreground leading-relaxed font-light text-sm sm:text-base">
              
              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Who we are
                </h2>
                <p className="mb-4">
                  Dako Studios is a creative studio based in Abuja, Nigeria. We operate two products under one roof:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    <strong className="text-foreground">Dako Studios Agency</strong> — web design, brand identity, motion design, film marketing, and related creative services (<Link href="/" className="text-primary hover:underline font-medium">dako.studio</Link>)
                  </li>
                  <li>
                    <strong className="text-foreground">Dako Studios Academy</strong> — a digital skills bootcamp for beginners (<a href="https://learn.dako.studio" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">learn.dako.studio</a>)
                  </li>
                </ul>
                <p>
                  When this policy says &quot;we&quot;, &quot;us&quot;, or &quot;Dako Studios&quot;, it means both products unless we say otherwise.
                </p>
                <p className="mt-4 font-mono text-xs text-muted-foreground/80">
                  Contact: <a href="mailto:hello@dako.studio" className="text-primary hover:underline font-medium">hello@dako.studio</a>
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  What information we collect
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      From agency clients and enquiries
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Name and business name</li>
                      <li>Email address and phone number</li>
                      <li>Details about your project or business that you share during discovery calls or email exchanges</li>
                      <li>Payment information (processed via Flutterwave, Paystack, or Deel — we do not store card details)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      From Academy students
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Name and email address at signup</li>
                      <li>Progress data — which lessons you have completed, which missions you have submitted</li>
                      <li>Submissions and capstone work you upload during the course</li>
                      <li>Payment information where applicable (same processors as above)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      From website visitors (dako.studio and learn.dako.studio)
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Pages visited and time spent — via basic analytics</li>
                      <li>Device type and browser</li>
                      <li>Referral source (how you found us)</li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4">
                  We do not use cookies beyond what is necessary for the site to function. We do not run advertising trackers on either site.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Why we collect it
                </h2>
                
                <div className="overflow-x-auto my-6 border border-border/20 rounded-lg bg-card/50 backdrop-blur-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/20 bg-muted/40 text-foreground font-mono text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Information</th>
                        <th className="p-4 font-semibold">Why we need it</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/15 text-sm">
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Name and contact details</td>
                        <td className="p-4">To respond to enquiries, deliver services, send course access</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Project details</td>
                        <td className="p-4">To scope and deliver your creative project accurately</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Payment details</td>
                        <td className="p-4">To process invoices and confirm enrollment</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Progress data (Academy)</td>
                        <td className="p-4">To track your learning, grade submissions, and issue your certificate</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Analytics data</td>
                        <td className="p-4">To understand which content is useful and improve both sites</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="font-medium text-foreground">
                  We do not sell your data. We do not share it with third parties for marketing purposes.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Who we share data with
                </h2>
                <p className="mb-4">
                  We share data only where necessary to deliver our services:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    <strong className="text-foreground">Flutterwave / Paystack</strong> — payment processing for Nigerian clients
                  </li>
                  <li>
                    <strong className="text-foreground">Deel</strong> — payment processing for international clients
                  </li>
                  <li>
                    <strong className="text-foreground">Vercel</strong> — website and Academy platform hosting
                  </li>
                  <li>
                    <strong className="text-foreground">Cloudflare</strong> — DNS, email routing, and site security
                  </li>
                  <li>
                    <strong className="text-foreground">Google</strong> — Google Drive (project file storage and delivery), Gmail (client communication)
                  </li>
                </ul>
                <p>
                  Each of these providers maintains their own privacy and security standards. We do not share your data with any other party without telling you first.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  How long we keep your data
                </h2>
                
                <div className="overflow-x-auto my-6 border border-border/20 rounded-lg bg-card/50 backdrop-blur-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/20 bg-muted/40 text-foreground font-mono text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Data type</th>
                        <th className="p-4 font-semibold">Retention period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/15 text-sm">
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Client project files</td>
                        <td className="p-4">12 months after project completion, then deleted unless you ask us to keep them</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Enquiry emails</td>
                        <td className="p-4">24 months</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Academy progress and submissions</td>
                        <td className="p-4">Duration of your enrollment + 12 months</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Payment records</td>
                        <td className="p-4">7 years (required for financial record-keeping)</td>
                      </tr>
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">Analytics data</td>
                        <td className="p-4">Rolling 12 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <Separator className="bg-border/10" />

              <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4 flex items-center gap-2">
                  Your rights under Nigerian law (NDPR)
                </h2>
                <p className="mb-4">
                  The Nigeria Data Protection Regulation (NDPR) gives you the following rights over your personal data:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li><strong className="text-foreground">Access</strong> — you can ask us what data we hold about you</li>
                  <li><strong className="text-foreground">Correction</strong> — you can ask us to correct inaccurate data</li>
                  <li><strong className="text-foreground">Deletion</strong> — you can ask us to delete your data, subject to legal retention requirements</li>
                  <li><strong className="text-foreground">Objection</strong> — you can object to how we use your data</li>
                  <li><strong className="text-foreground">Portability</strong> — you can ask us to send you a copy of your data in a readable format</li>
                </ul>
                <p className="mb-4">
                  To exercise any of these rights, email us at <a href="mailto:hello@dako.studio" className="text-primary hover:underline font-semibold">hello@dako.studio</a>. We will respond within 14 days.
                </p>
                <p className="text-sm">
                  If you are not satisfied with our response, you may contact the Nigeria Data Protection Commission (NDPC) at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">ndpc.gov.ng</a>.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Data security
                </h2>
                <p className="mb-4">
                  We take reasonable steps to protect your data:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>All sites run on HTTPS.</li>
                  <li>Access to client files is restricted to the Dako Studios team.</li>
                  <li>Payment processing is handled entirely by our payment providers — we never see or store full card details.</li>
                  <li>Academy student data is stored on Vercel-hosted infrastructure with access controls.</li>
                </ul>
                <p>
                  No system is completely secure. If we ever become aware of a breach that affects your data, we will notify you promptly.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Children
                </h2>
                <p>
                  Our Academy is designed for adults. We do not knowingly collect data from anyone under 18. If you believe a minor has submitted data to us, contact us at <a href="mailto:hello@dako.studio" className="text-primary hover:underline font-medium">hello@dako.studio</a> and we will delete it immediately.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                  Changes to this policy
                </h2>
                <p>
                  If we make material changes to this policy, we will update the effective date at the top and notify active clients and students by email. Continued use of our services after a change means you accept the updated policy.
                </p>
              </section>

              <Separator className="bg-border/10" />

              <section className="bg-card border border-border/20 rounded-xl p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Contact
                </h2>
                <p className="mb-4 text-sm">
                  Questions about this policy or your data:
                </p>
                <div className="font-mono text-xs space-y-1 text-muted-foreground/90">
                  <p><span className="text-foreground">Email:</span> <a href="mailto:hello@dako.studio" className="text-primary hover:underline">hello@dako.studio</a></p>
                  <p><span className="text-foreground">Studio:</span> Dako Studios, Abuja, Nigeria</p>
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
