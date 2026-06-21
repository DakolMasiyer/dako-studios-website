import fs from 'fs'
import path from 'path'
import { Lead } from './marketing-data'

/**
 * Reply triage via the Gemini API. Reads a prospect's reply against the outreach
 * spec (content/outreach/dako-cold.md) and returns a stage + a *suggested* reply.
 * The suggestion is NEVER auto-sent — it is written to the lead for human review.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
// Fast + cheap default; override with GEMINI_MODEL (e.g. gemini-2.5-pro) for more nuance.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export function isTriageConfigured(): boolean {
  return Boolean(GEMINI_API_KEY)
}

export type TriageStage = 'Proposal Sent' | 'Contacted' | 'Lost'

export interface TriageResult {
  stage: TriageStage
  suggested_reply: string
  reasoning: string
}

let specCache: string | null = null
function loadSpec(): string {
  if (specCache !== null) return specCache
  try {
    specCache = fs.readFileSync(path.join(process.cwd(), 'content/outreach/dako-cold.md'), 'utf8')
  } catch {
    specCache = ''
  }
  return specCache
}

function extractJson(text: string): TriageResult | null {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    const obj = JSON.parse(text.slice(start, end + 1))
    if (typeof obj.suggested_reply === 'string' && typeof obj.stage === 'string') {
      return {
        stage: (['Proposal Sent', 'Contacted', 'Lost'].includes(obj.stage) ? obj.stage : 'Contacted') as TriageStage,
        suggested_reply: obj.suggested_reply,
        reasoning: typeof obj.reasoning === 'string' ? obj.reasoning : '',
      }
    }
  } catch {
    /* fall through */
  }
  return null
}

export async function triageReply(lead: Lead, replyText: string): Promise<TriageResult> {
  if (!isTriageConfigured()) {
    throw new Error('Triage not configured. Set GEMINI_API_KEY.')
  }

  const prompt = `You are triaging a reply to a cold outreach email for Dako Studios.

Spec (voice, objections, banned phrases) — follow it exactly:
${loadSpec()}

Original outreach: Template ${lead.template || 'A'} cold opener offering a free short motion-video concept.
Company: ${lead.company || 'Unknown'}, ${lead.industry || 'unknown industry'}
Their reply:
"""
${replyText}
"""

Return ONLY valid JSON, no prose before or after:
{
  "stage": "Proposal Sent" | "Contacted" | "Lost",
  "suggested_reply": "the actual reply text to send, in the dako-cold.md voice, handling any objection per the spec. A human will review before sending.",
  "reasoning": "one line on why this stage and this angle"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY as string,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  )
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const text = (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('\n')
  const parsed = extractJson(text)
  if (!parsed) {
    throw new Error('Triage returned unparseable output')
  }
  return parsed
}
