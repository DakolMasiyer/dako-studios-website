export type TemplateFormat =
  | 'feed-post'
  | 'story'
  | 'carousel'
  | 'testimonial'
  | 'process-explainer'

export type Arm = 'studio' | 'labs' | 'brand' | 'motion' | 'film' | 'academy'

export const TEMPLATE_FORMATS: { value: TemplateFormat; label: string }[] = [
  { value: 'feed-post', label: 'Feed Post' },
  { value: 'story', label: 'Story' },
  { value: 'carousel', label: 'Case Study Carousel' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'process-explainer', label: 'Process Explainer' },
]

export const ARMS: { value: Arm; label: string }[] = [
  { value: 'studio', label: 'Studio (Crimson)' },
  { value: 'labs', label: 'Labs' },
  { value: 'brand', label: 'Brand' },
  { value: 'motion', label: 'Motion' },
  { value: 'film', label: 'Film' },
  { value: 'academy', label: 'Academy' },
]

interface FormatInferenceInput {
  format?: string
  platform?: string
}

export function inferTemplateFormat({ format = '', platform = '' }: FormatInferenceInput): TemplateFormat {
  const text = `${format} ${platform}`.toLowerCase()

  if (text.includes('carousel')) return 'carousel'
  if (text.includes('story') || text.includes('stories')) return 'story'
  if (text.includes('testimonial') || text.includes('review') || text.includes('social proof')) return 'testimonial'
  if (text.includes('process') || text.includes('day-by-day') || text.includes('5-day') || text.includes('how we')) {
    return 'process-explainer'
  }
  return 'feed-post'
}

interface ArmInferenceInput {
  pillar?: string
  format?: string
  topic?: string
  category?: string
}

export function inferArm({ pillar = '', format = '', topic = '', category = '' }: ArmInferenceInput): Arm {
  const text = `${pillar} ${format} ${topic} ${category}`.toLowerCase()

  if (text.includes('academy')) return 'academy'
  if (text.includes('film') || text.includes('cinematic') || text.includes('movie')) return 'film'
  if (text.includes('motion') || text.includes('video ad') || text.includes('reel')) return 'motion'
  if (text.includes('brand') || text.includes('identity') || text.includes('logo')) return 'brand'
  if (text.includes('labs') || text.includes('web') || text.includes('site') || text.includes('ux')) return 'labs'
  return 'studio'
}
