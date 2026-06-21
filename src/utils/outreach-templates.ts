import { Lead } from './marketing-data'

/**
 * Cold outreach copy for the Dako Studios motion-video pipeline.
 * Mirrors content/outreach/outreach_templates.md (A/B/C) plus the bump + breakup
 * follow-ups. Plain text only — no links, logos, or attachments in the first send
 * (deliverability). One real detail per opener, pulled from the lead's description.
 */

export type TemplateKey = 'A' | 'B' | 'C'

export interface BuiltEmail {
  subject: string
  body: string
}

const FROM_NAME = process.env.OUTREACH_FROM_NAME || 'Dakol'
const OPT_OUT = 'If you\'d rather I didn\'t follow up, just reply STOP and I won\'t.'

/** Stable per-lead pick so subject rotation is deterministic but varied across the batch. */
function pick<T>(options: T[], seed: string): T {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return options[h % options.length]
}

function cityFrom(lead: Lead): string {
  const hay = `${lead.address || ''} ${lead.description || ''}`.toLowerCase()
  if (hay.includes('abuja')) return 'Abuja'
  if (hay.includes('lagos') || hay.includes('lekki') || hay.includes('surulere') || hay.includes('ikeja')) return 'Lagos'
  return 'Lagos or Abuja'
}

/** One specific, non-generic detail about the company for the opener. */
function detailFrom(lead: Lead): string {
  const d = (lead.description || '').trim()
  if (d && d.toLowerCase() !== `${(lead.industry || '').toLowerCase()}`) {
    const lower = d.charAt(0).toLowerCase() + d.slice(1)
    return lower.replace(/\.$/, '')
  }
  // Fall back to the industry phrased as a detail rather than a generic "your brand".
  return `your ${(lead.industry || 'product').toLowerCase()} line`
}

function signature(): string {
  return `Best,\n${FROM_NAME}\nDako Studios`
}

function companyName(lead: Lead): string {
  return lead.company || 'your team'
}

/** Day-0 opener, by template. */
export function buildOpener(lead: Lead): BuiltEmail {
  const company = companyName(lead)
  const city = cityFrom(lead)
  const detail = detailFrom(lead)
  const template = (lead.template || 'A') as TemplateKey

  if (template === 'B') {
    const subject = pick(
      [`A 15 second styling video for ${company}`, `Quick idea for showing ${company}'s pieces in motion`, `Saw ${company} online — one thought`],
      lead.id
    )
    const body =
`Hi ${company} team,

I've been looking at boutiques and fashion labels around ${city}, and ${company} stood out, ${detail}.

Static photos only show so much. Movement, the way fabric falls, how an outfit looks walking, is what actually sells fashion on Instagram and TikTok now. I make short styling videos for boutiques like yours, and I'd like to put one together for ${company} free of charge, just to show you the difference it makes.

If you're open to it, send me two or three pieces (photos I can work from) and I'll get a short concept back to you.

${signature()}

${OPT_OUT}`
    return { subject, body }
  }

  if (template === 'C') {
    const subject = pick(
      [`A short video idea for ${company}`, `Quick thought on ${company}'s socials`, `20 seconds that could fill more tables at ${company}`],
      lead.id
    )
    const body =
`Hi ${company} team,

I've been looking at restaurants and venues in ${city} worth featuring, and ${company} came up, ${detail}.

I make short video content for restaurants, the kind that captures plating, ambience and service in a way a photo can't, built for Instagram Reels and Status. I'd like to put a short concept together for ${company} at no cost, just to show you what it would look like.

If that's of interest, let me know a good time and I can work from photos or footage you already have.

${signature()}

${OPT_OUT}`
    return { subject, body }
  }

  // Template A — product brands
  const subject = pick(
    [`A quick video idea for ${company}`, `Saw ${company} — quick thought`, `20 seconds that could sell more for ${company}`],
    lead.id
  )
  const body =
`Hi ${company} team,

I came across ${company} while looking at ${(lead.industry || 'product').toLowerCase()} brands in ${city}, and ${detail}.

I make short product motion videos, the kind that stop the scroll on Instagram and WhatsApp Status rather than another static product photo. I'd like to put one together for ${company}, no cost, no obligation, just to show you what it could look like for your products.

If that's useful, reply with one or two product images and I'll turn around a short concept within a few days.

${signature()}

${OPT_OUT}`
  return { subject, body }
}

/** Day 4–5 bump — short nudge, no new pitch. Sent in-thread (no subject change needed). */
export function buildBump(lead: Lead): BuiltEmail {
  const company = companyName(lead)
  return {
    subject: `Re: A quick video idea for ${company}`,
    body:
`Hi ${company}, following up on my note below in case it got buried. Happy to put a short concept together for ${company} whenever's useful, no pressure either way.

${signature()}`,
  }
}

/** Day 10 breakup — easy out, leaves the door open. Then stop. */
export function buildBreakup(lead: Lead): BuiltEmail {
  const company = companyName(lead)
  return {
    subject: `Re: A quick video idea for ${company}`,
    body:
`No worries if now isn't the right time for ${company} — happy to circle back later in the year if that's better.

${signature()}`,
  }
}
