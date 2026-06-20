import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react'
import { getCaseStudyBySlug, getCaseStudies } from '@/utils/case-studies'
import { services } from '@/data/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoHero } from '@/components/video-hero'
import { LandingNavbar } from '../../landing/components/navbar'
import { LandingFooter } from '../../landing/components/footer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const caseStudies = getCaseStudies()
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const caseStudy = getCaseStudyBySlug(resolvedParams.slug)
  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Dako Studios',
    }
  }
  return {
    title: `${caseStudy.title} | Dako Studios`,
    description: caseStudy.summary,
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const resolvedParams = await params
  const caseStudy = getCaseStudyBySlug(resolvedParams.slug)

  if (!caseStudy) {
    notFound()
  }

  const arm = services.find((s) => s.id === caseStudy.arm)

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNavbar />

      <main className="flex-grow py-16 sm:py-24">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back link */}
          <div className="mb-10">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Case Studies
            </Link>
          </div>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {arm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  {arm.subtitle}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border/30 text-muted-foreground text-xs font-medium">
                <Building2 className="h-3 w-3" />
                {caseStudy.client}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {caseStudy.title}
            </h1>

            <p className="text-lg sm:text-xl font-light text-muted-foreground leading-relaxed max-w-2xl">
              {caseStudy.summary}
            </p>

            {caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {caseStudy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-muted/40 text-muted-foreground border border-border/30 rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Hero video or image */}
          {(caseStudy.video || caseStudy.heroImage) && (
            <div className="relative aspect-video w-full overflow-hidden rounded-[8px] border border-border/20 mb-12">
              {caseStudy.video ? (
                <VideoHero
                  src={caseStudy.video}
                  poster={caseStudy.heroImage || undefined}
                />
              ) : (
                <Image
                  src={caseStudy.heroImage}
                  alt={caseStudy.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          )}

          {/* Results */}
          {caseStudy.results.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
              {caseStudy.results.map((result, index) => (
                <Card
                  key={index}
                  className="text-center bg-card border-border/40 py-0 rounded-[8px]"
                >
                  <CardContent className="p-5 sm:p-6">
                    <p className="text-xl sm:text-2xl font-display font-bold text-primary mb-1">
                      {result.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                      {result.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Gallery */}
          {caseStudy.gallery.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-16">
              {caseStudy.gallery.map((image, index) => (
                <div
                  key={image}
                  className={`relative aspect-video overflow-hidden rounded-[8px] border border-border/20 ${
                    caseStudy.gallery.length % 2 === 1 && index === caseStudy.gallery.length - 1
                      ? 'sm:col-span-2'
                      : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${caseStudy.title} — visual ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Closing copy */}
          {caseStudy.content && (
            <p className="text-base sm:text-lg font-light text-muted-foreground leading-relaxed max-w-2xl mb-16">
              {caseStudy.content}
            </p>
          )}

          {/* CTA */}
          <div className="border-t border-border/20 pt-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 tracking-tight">
              Want results like this?
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
              Book a free discovery call and let&apos;s scope your project.
            </p>
            <Button
              size="lg"
              className="cursor-pointer px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] font-semibold"
              asChild
            >
              <Link href="/contact">
                Book a Discovery Call
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </article>
      </main>

      <LandingFooter />
    </div>
  )
}
