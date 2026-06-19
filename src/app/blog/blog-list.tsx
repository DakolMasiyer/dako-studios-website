"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/utils/blog'
import { Calendar, ArrowRight, BookOpen, Search } from 'lucide-react'

interface BlogListProps {
  initialPosts: BlogPost[]
}

export function BlogList({ initialPosts }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    const cats = new Set(initialPosts.map(post => post.category))
    return ['All', ...Array.from(cats)]
  }, [initialPosts])

  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [initialPosts, selectedCategory, searchQuery])

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Dako Studios Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4 text-foreground">
            Frontline Insights
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Positioning, engineering, and digital growth strategy for small businesses and creative studios.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border/20 pb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/40 border border-border/30 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground/60"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <article
                key={post.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[8px] border border-border/40 bg-card/40 backdrop-blur-md p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div>
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground/80 mb-4 font-medium">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      <BookOpen className="h-3 w-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-display font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                    <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
                    {post.description}
                  </p>
                </div>

                {/* Footer/Action */}
                <div className="flex items-center justify-between border-t border-border/20 pt-4 mt-auto">
                  <span className="text-xs text-muted-foreground/60">
                    By {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    Read Article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border/40 rounded-[8px]">
            <p className="text-muted-foreground font-light text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
