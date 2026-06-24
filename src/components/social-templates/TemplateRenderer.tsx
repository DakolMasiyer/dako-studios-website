import { ExportableCanvas } from './ExportableCanvas'
import { FeedPostTemplate } from './FeedPostTemplate'
import { StoryTemplate } from './StoryTemplate'
import { CarouselTemplate } from './CarouselTemplate'
import { TestimonialTemplate } from './TestimonialTemplate'
import { ProcessExplainerTemplate } from './ProcessExplainerTemplate'
import type { Arm, TemplateFormat } from '@/utils/social-templates'

// Deliberately decoupled from CalendarPost/CopyAsset (src/utils/marketing-data.ts) so this
// component tree has no dependency on that file's server-only (fs/path) imports.
export interface TemplateSource {
  topic?: string
  day?: string
  platform?: string
  format?: string
  pillar?: string
  category?: string
  copy?: string
  content?: string
  cta?: string
}

export interface TemplateRendererProps {
  format: TemplateFormat
  arm: Arm
  source: TemplateSource
  fileName: string
  showDownloadButton?: boolean
}

const FEED_FORMAT_SIZE = { width: 1080, height: 1350 }
const STORY_FORMAT_SIZE = { width: 1080, height: 1920 }

export function TemplateRenderer({ format, arm, source, fileName, showDownloadButton = true }: TemplateRendererProps) {
  const body = source.copy || source.content || ''
  const headline = source.topic || 'Dako Studios'
  const badge = source.platform || source.category

  if (format === 'carousel') {
    return (
      <CarouselTemplate
        arm={arm}
        fileName={fileName}
        showDownloadButton={showDownloadButton}
        slides={[{ eyebrow: badge, heading: headline, body }]}
      />
    )
  }

  if (format === 'story') {
    return (
      <ExportableCanvas {...STORY_FORMAT_SIZE} arm={arm} fileName={fileName} showDownloadButton={showDownloadButton}>
        <StoryTemplate
          arm={arm}
          eyebrow={badge}
          headline={headline}
          subhead={body}
          ctaLabel={source.cta || 'dako.studio →'}
          hint={source.day}
        />
      </ExportableCanvas>
    )
  }

  if (format === 'testimonial') {
    return (
      <ExportableCanvas {...FEED_FORMAT_SIZE} arm={arm} fileName={fileName} showDownloadButton={showDownloadButton}>
        <TestimonialTemplate arm={arm} quote={body || headline} />
      </ExportableCanvas>
    )
  }

  if (format === 'process-explainer') {
    // Best-effort: turn freeform copy into numbered steps by splitting on newlines.
    // Falls back to a single step if the copy isn't already step-shaped — refine by
    // hand-editing source.copy in the markdown/Copy Bank if the auto-split looks wrong.
    const steps = body
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 6)
      .map((line, i) => ({ label: `STEP ${String(i + 1).padStart(2, '0')}`, title: line }))

    return (
      <ExportableCanvas {...FEED_FORMAT_SIZE} arm={arm} fileName={fileName} showDownloadButton={showDownloadButton}>
        <ProcessExplainerTemplate
          arm={arm}
          badge={badge}
          headline={headline}
          steps={steps.length > 0 ? steps : [{ label: 'STEP 01', title: headline }]}
          footer={source.cta}
        />
      </ExportableCanvas>
    )
  }

  // default: feed-post
  return (
    <ExportableCanvas {...FEED_FORMAT_SIZE} arm={arm} fileName={fileName} showDownloadButton={showDownloadButton}>
      <FeedPostTemplate arm={arm} badge={badge} headline={headline} subhead={body} />
    </ExportableCanvas>
  )
}
