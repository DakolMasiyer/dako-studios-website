import React from 'react'
import { getBlogPosts } from '@/utils/blog'
import { BlogList } from './blog-list'
import { LandingNavbar } from '../landing/components/navbar'
import { LandingFooter } from '../landing/components/footer'

export const metadata = {
  title: 'Blog | Dako Studios',
  description: 'Insights, positioning, and engineering from the creative frontline. Standard-setting design and digital marketing tactics for small businesses.',
}

export default function BlogListingPage() {
  const posts = getBlogPosts()
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-grow">
        <BlogList initialPosts={posts} />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
