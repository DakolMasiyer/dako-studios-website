import React from 'react'
import { getCaseStudies } from '@/utils/case-studies'
import { CaseStudiesList } from './case-studies-list'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'

export const metadata = {
  title: 'Case Studies | Dako Studios',
  description: 'Real projects, real results — across web, brand, motion, and film.',
}

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies()

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNavbar />

      <main className="flex-grow">
        <CaseStudiesList initialCaseStudies={caseStudies} />
      </main>

      <LandingFooter />
    </div>
  )
}
