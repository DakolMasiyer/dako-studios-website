"use client"

import { useState } from 'react'
import { Share2, ExternalLink, Check } from 'lucide-react'

interface CaseStudyActionsProps {
  title: string
  externalUrl?: string
}

export function CaseStudyActions({ title, externalUrl }: CaseStudyActionsProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {}
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="w-9 h-9 rounded-full border border-border/40 bg-muted/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/70 hover:bg-muted/20 transition-colors cursor-pointer"
        aria-label={copied ? 'Link copied' : 'Share'}
        title={copied ? 'Link copied!' : 'Share'}
      >
        {copied
          ? <Check className="h-4 w-4 text-primary" />
          : <Share2 className="h-4 w-4" />
        }
      </button>

      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full border border-border/40 bg-muted/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/70 hover:bg-muted/20 transition-colors cursor-pointer"
          aria-label="Visit website"
          title="Visit website"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}
