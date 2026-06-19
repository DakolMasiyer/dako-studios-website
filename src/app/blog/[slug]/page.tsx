import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPostBySlug, getBlogPosts } from '@/utils/blog'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { LandingNavbar } from '../../landing/components/navbar'
import { LandingFooter } from '../../landing/components/footer'
import { Calendar, ArrowLeft, BookOpen, Clock } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams.slug)
  if (!post) {
    return {
      title: 'Post Not Found | Dako Studios Blog',
    }
  }
  return {
    title: `${post.title} | Dako Studios Blog`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  // Calculate reading time based on ~200 words per minute
  const words = post.content.split(/\s+/).length
  const readingTime = Math.ceil(words / 200)

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Navigation */}
      <LandingNavbar />

      {/* Article Content */}
      <main className="flex-grow py-16 sm:py-24">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Back button */}
          <div className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12 border-b border-border/20 pb-10">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground/80">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground/80">
                <Clock className="h-3.5 w-3.5" />
                {readingTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl font-light text-muted-foreground leading-relaxed italic">
              {post.description}
            </p>
          </header>

          {/* Rendered Body */}
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border/20">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">Founder, Dako Studios</p>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-muted/40 text-muted-foreground border border-border/30 rounded-md font-medium"
                    >
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
