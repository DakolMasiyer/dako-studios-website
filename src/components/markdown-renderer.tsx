import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Normalize line endings and split by double newlines to find paragraphs/blocks
  const blocks = content.replace(/\r/g, '').split(/\n\n+/)

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight mt-12 mb-6 text-foreground leading-tight">
              {renderInline(trimmed.slice(2))}
            </h1>
          )
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl sm:text-3xl font-display font-bold tracking-tight mt-10 mb-4 border-b border-border/20 pb-2 text-foreground">
              {renderInline(trimmed.slice(3))}
            </h2>
          )
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl sm:text-2xl font-display font-semibold tracking-tight mt-8 mb-3 text-foreground">
              {renderInline(trimmed.slice(4))}
            </h3>
          )
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          const lines = trimmed.split('\n').map(line => line.replace(/^>\s?/, ''))
          return (
            <blockquote key={idx} className="border-l-4 border-primary/60 pl-4 py-1.5 my-6 bg-primary/5 rounded-r-[4px] italic text-muted-foreground leading-relaxed">
              {lines.map((line, lIdx) => (
                <p key={lIdx} className="mb-2 last:mb-0">
                  {renderInline(line)}
                </p>
              ))}
            </blockquote>
          )
        }

        // Horizontal Rule
        if (trimmed === '---') {
          return <hr key={idx} className="my-8 border-border/20" />
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(Boolean)
          return (
            <ul key={idx} className="list-disc list-inside space-y-2.5 my-4 text-muted-foreground font-light leading-relaxed pl-2">
              {items.map((item, itemIdx) => {
                const cleanedItem = item.replace(/^[-\*]\s+/, '')
                return <li key={itemIdx}>{renderInline(cleanedItem)}</li>
              })}
            </ul>
          )
        }

        // Ordered List
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').filter(Boolean)
          return (
            <ol key={idx} className="list-decimal list-inside space-y-2.5 my-4 text-muted-foreground font-light leading-relaxed pl-2">
              {items.map((item, itemIdx) => {
                const cleanedItem = item.replace(/^\d+\.\s+/, '')
                return <li key={itemIdx}>{renderInline(cleanedItem)}</li>
              })}
            </ol>
          )
        }

        // Regular Paragraph
        return (
          <p key={idx} className="text-base sm:text-lg font-light text-muted-foreground leading-relaxed">
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let currentIndex = 0

  // Regexes for bold, italic, and links
  const inlineRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g
  let match

  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index

    // Append preceding text
    if (matchIndex > currentIndex) {
      parts.push(text.slice(currentIndex, matchIndex))
    }

    const [fullMatch, , boldText, italicText, linkText, linkUrl] = match

    if (boldText) {
      parts.push(<strong key={matchIndex} className="font-bold text-foreground">{boldText}</strong>)
    } else if (italicText) {
      parts.push(<em key={matchIndex} className="italic text-muted-foreground">{italicText}</em>)
    } else if (linkText && linkUrl) {
      const isExternal = linkUrl.startsWith('http')
      parts.push(
        <a
          key={matchIndex}
          href={linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline font-semibold"
        >
          {linkText}
        </a>
      )
    }

    currentIndex = inlineRegex.lastIndex
  }

  // Append remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex))
  }

  return parts.length > 0 ? parts : [text]
}
