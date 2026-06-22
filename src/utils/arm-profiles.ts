import fs from 'fs'
import path from 'path'

// Declarative per-arm config — adding a third arm is one new map entry, not a code change.

export type Arm = 'Motion' | 'Labs' | 'Brand' | 'Film' | 'Academy'

export interface ArmProfile {
  arm: Arm
  serviceOneLiner: string
  gaps: string[]
  voiceSpecPath: string
}

export const ARM_PROFILES: Record<Arm, ArmProfile> = {
  Motion: {
    arm: 'Motion',
    serviceOneLiner: 'Short motion-design and product video ads for SMBs in Lagos and Abuja.',
    gaps: [
      'no video anywhere on site/socials',
      'only static product photos',
      'dated/low-quality existing video',
      'active growing social presence with zero motion content',
    ],
    voiceSpecPath: 'content/outreach/dako-cold.md',
  },
  Labs: {
    arm: 'Labs',
    serviceOneLiner: 'UX-led websites for SMBs and professional-services firms, delivered in 5-10 days, fully yours at handoff.',
    gaps: [
      'broken or missing contact form',
      'no online booking/ordering where the business clearly needs it',
      'slow, dated, or non-mobile-friendly site',
      'product/service business with no website at all',
      'site built on a generic template with no differentiation',
    ],
    voiceSpecPath: 'content/outreach/labs-cold.md',
  },
  // DRAFT — first-pass positioning, not yet reviewed/validated. Do not enable in live
  // (non-dry-run) cron runs until a human reviews these gaps + the linked voice-spec files.
  Brand: {
    arm: 'Brand',
    serviceOneLiner: 'Polished, versatile visual identity systems — logo, colour, type, and brand guidelines — for SMBs outgrowing a DIY look.',
    gaps: [
      'logo is a default font/template wordmark with no real mark',
      'inconsistent colours/fonts across site and social profiles',
      'no cohesive visual identity across packaging, signage, and socials',
      'business has rebranded products/services but kept the original dated logo',
      'social profile and website use visibly different logos or colour palettes',
    ],
    voiceSpecPath: 'content/outreach/brand-cold.md',
  },
  // DRAFT — first-pass positioning, not yet reviewed/validated. Do not enable in live
  // (non-dry-run) cron runs until a human reviews these gaps + the linked voice-spec files.
  Film: {
    arm: 'Film',
    serviceOneLiner: 'Moody, atmospheric cinematic films for events, hospitality, and fashion brands that static photography can\'t capture.',
    gaps: [
      'no event/brand film anywhere on site or socials',
      'only phone-shot or low-production-value video of events/venues',
      'venue or event business with photo-only marketing despite a visually rich space',
      'fashion/hospitality brand with no campaign or lookbook film',
    ],
    voiceSpecPath: 'content/outreach/film-cold.md',
  },
  // DRAFT — first-pass positioning, not yet reviewed/validated. Do not enable in live
  // (non-dry-run) cron runs until a human reviews these gaps + the linked voice-spec files.
  Academy: {
    arm: 'Academy',
    serviceOneLiner: 'Approachable, hands-on creative-skills training — the same studio DNA, taught — for beginners building a real portfolio piece.',
    gaps: [
      'not an outbound-prospecting fit in the same sense as the other arms — see report',
    ],
    voiceSpecPath: 'content/outreach/academy-cold.md',
  },
}

const specCache: Partial<Record<Arm, string>> = {}

// Mirrors triage.ts's loadSpec() pattern: read once, cache, fail soft to empty string.
export function loadArmVoiceSpec(arm: Arm): string {
  if (specCache[arm] !== undefined) return specCache[arm] as string
  try {
    specCache[arm] = fs.readFileSync(path.join(process.cwd(), ARM_PROFILES[arm].voiceSpecPath), 'utf8')
  } catch {
    specCache[arm] = ''
  }
  return specCache[arm] as string
}
