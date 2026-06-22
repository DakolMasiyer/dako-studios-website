import { ARM_PROFILES, loadArmVoiceSpec, Arm } from './arm-profiles'

/**
 * Lead qualification + cold-email drafting via the Gemini API. Takes a lead that already
 * passed categorical fit and checks for a named, checkable gap in the evidence, then drafts
 * a tailored opener referencing that gap. The draft is NEVER auto-sent — a human reviews it.
 */

// Rotation pool, in spend order — numbered free-tier keys first, the paid key last so
// it's only touched once every free key has hit its daily/per-minute quota.
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_PAID_API_KEY,
].filter((k): k is string => Boolean(k))

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

// Sticky across calls within a process — once a key gets rate-limited we stay on the
// next one rather than re-trying the dead key on every subsequent lead.
let keyCursor = 0

export function isQualificationConfigured(): boolean {
  return GEMINI_KEYS.length > 0
}

export type QualificationStatus = 'Qualified' | 'Low priority' | 'Disqualified'

export interface QualificationResult {
  qualification_status: QualificationStatus
  qualification_reason: string
  pain_point: string
  customized_email_subject: string
  customized_email_body: string
}

const STATUSES: QualificationStatus[] = ['Qualified', 'Low priority', 'Disqualified']

function extractJson(text: string): QualificationResult | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    const obj = JSON.parse(text.slice(start, end + 1))
    if (typeof obj.pain_point === 'string' && typeof obj.customized_email_body === 'string') {
      return {
        qualification_status: (STATUSES.includes(obj.qualification_status)
          ? obj.qualification_status
          : 'Low priority') as QualificationStatus,
        qualification_reason: typeof obj.qualification_reason === 'string' ? obj.qualification_reason : '',
        pain_point: obj.pain_point,
        customized_email_subject: typeof obj.customized_email_subject === 'string' ? obj.customized_email_subject : '',
        customized_email_body: obj.customized_email_body,
      }
    }
  } catch {
    /* fall through */
  }
  return null
}

/**
 * Calls Gemini with the rotation pool, advancing `keyCursor` past any key that comes
 * back 401 (bad credential) or 429 (quota exhausted) and retrying the same request on
 * the next one. A 503 (model overloaded) is transient server load, not a key problem,
 * so it's retried on the same key with backoff before falling through to the next key.
 * Throws only once every key in the pool has failed.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function generateContent(prompt: string): Promise<string> {
  let lastError = ''
  for (let attempt = 0; attempt < GEMINI_KEYS.length; attempt++) {
    const keyIndex = keyCursor
    const key = GEMINI_KEYS[keyIndex]

    for (let retry = 0; retry < 4; retry++) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: 'POST',
          headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 2048,
              // Disable extended thinking — it was consuming nearly the whole token budget on
              // this model, truncating the JSON answer before it could finish (MAX_TOKENS).
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
        }
      )
      if (res.status === 401 || res.status === 429) {
        lastError = `key #${keyIndex + 1}: ${res.status} ${await res.text()}`
        break
      }
      if (res.status === 503) {
        lastError = `key #${keyIndex + 1}: 503 (overloaded)`
        if (retry < 3) {
          await sleep(1000 * 2 ** retry)
          continue
        }
        break
      }
      if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${await res.text()}`)
      }
      const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
      return (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('\n')
    }

    if (keyIndex < GEMINI_KEYS.length - 1) keyCursor = keyIndex + 1
  }
  throw new Error(`Gemini API error: all ${GEMINI_KEYS.length} keys exhausted. Last: ${lastError}`)
}

export async function qualifyLead(input: {
  company: string
  niche: string
  arm: Arm
  evidence: string
}): Promise<QualificationResult> {
  if (!isQualificationConfigured()) {
    throw new Error('Qualification not configured. Set GEMINI_API_KEY.')
  }

  const profile = ARM_PROFILES[input.arm]
  const spec = loadArmVoiceSpec(input.arm)

  const prompt = `You are qualifying a cold-outreach lead for Dako Studios' ${input.arm} arm and drafting the opener email if it qualifies.

Service: ${profile.serviceOneLiner}

Gaps that qualify a lead for this arm (the evidence must clearly show one of these, not something adjacent or assumed):
${profile.gaps.map((g) => `- ${g}`).join('\n')}

Voice spec (tone, sequence, banned phrases) — the email must follow this exactly:
${spec}

Company: ${input.company}
Niche: ${input.niche}
Evidence (what we know about their web/social presence):
"""
${input.evidence}
"""

Instructions:
- Name a SPECIFIC, checkable gap from the evidence above — never vague filler like "could improve their marketing." If the evidence does not clearly show one of the listed gaps, return "Low priority" honestly rather than inventing a gap.
- Only return "Disqualified" if the evidence suggests this isn't a real or reachable business at all. Categorical fit was already checked before this — disqualifying should be rare.
- "pain_point" is one short, sharp sentence: the single observation the email opener leads with.
- "customized_email_subject" and "customized_email_body" are the actual cold-opener email, written in the voice spec above — UK English, plain text, no links or attachments, no fake urgency, none of the banned phrases, first-person founder voice, one clear ask. Follow the spec's Sequence opener guidance (day 0 opener: one specific detail, one clear ask) and weave in the named pain point as the one specific detail. If qualification_status is not "Qualified", still return best-effort subject/body fields as empty strings.
- "qualification_reason" is the internal audit trail — what evidence this is based on, in plain language for a human reviewer. It is NOT customer-facing and must not appear in the email.

Return ONLY valid JSON, no prose before or after:
{
  "qualification_status": "Qualified" | "Low priority" | "Disqualified",
  "qualification_reason": "internal note on what evidence this is based on",
  "pain_point": "one sharp sentence",
  "customized_email_subject": "subject line in the arm's voice",
  "customized_email_body": "full email body in the arm's voice"
}`

  const text = await generateContent(prompt)
  const parsed = extractJson(text)
  if (!parsed) {
    // never throw a lead away silently on a parse miss — fall back to a reviewable Low priority
    return {
      qualification_status: 'Low priority',
      qualification_reason: 'Model returned unparseable output; flagged for manual review.',
      pain_point: '',
      customized_email_subject: '',
      customized_email_body: '',
    }
  }
  return parsed
}
