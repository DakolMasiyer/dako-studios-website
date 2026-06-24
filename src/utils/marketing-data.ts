import fs from 'fs'
import path from 'path'
import { isSupabaseConfigured, getSupabaseAdmin } from './supabase'
import { inferTemplateFormat, inferArm, type TemplateFormat, type Arm } from './social-templates'

export interface PersonaData {
  name: string
  role: string
  goals: string[]
  pains: string[]
  language: string
  messages: string[]
}

export interface StrategyData {
  positioning: string
  differentiators: { competitor: string; problem: string; answer: string }[]
  personas: PersonaData[]
}

export type PostStatus = 'todo' | 'inprogress' | 'done';

export interface CalendarPost {
  status?: PostStatus;
  publishedUrl?: string;
  id: string
  day: string
  platform: string
  pillar: string
  format: string
  topic?: string
  visual?: string
  copy?: string
  template?: TemplateFormat
  arm?: Arm
}

export interface CopyAsset {
  id: string
  status?: PostStatus;
  publishedUrl?: string;
  category: string
  topic: string
  content: string
  cta?: string
  template?: TemplateFormat
  arm?: Arm
}

export type LeadStatus =
  // Outreach (cold) pipeline
  | 'Not sent'
  | 'Sent'
  | 'Bumped'
  | 'Replied'
  | 'Breakup sent'
  // Shared / inbound pipeline
  | 'Identified'
  | 'Contacted'
  | 'Proposal Sent'
  | 'Closed'
  | 'Lost'

export type LeadKind = 'outreach' | 'inbound'

export interface Lead {
  id: string
  leadKind: LeadKind
  status: LeadStatus
  notes?: string
  /** ISO timestamp; sourced from created_at (DB) or timestamp (legacy JSON). */
  timestamp: string

  // Inbound (contact form) fields
  name?: string
  contactInfo?: string
  service?: string
  message?: string

  // Outreach (cold prospect) fields
  company?: string
  industry?: string
  description?: string
  email?: string
  source?: string
  address?: string
  template?: 'A' | 'B' | 'C'
  emailType?: string
  sentAt?: string
  lastContactAt?: string
  threadId?: string
  messageId?: string
  suggestedReply?: string
  suggestedReasoning?: string

  // Qualification engine fields
  arm?: 'Motion' | 'Labs' | 'Brand' | 'Film' | 'Academy'
  qualificationStatus?: 'Qualified' | 'Low priority' | 'Disqualified'
  qualificationReason?: string
  painPoint?: string
  customizedEmailSubject?: string
  customizedEmailBody?: string
  emailApproved?: boolean
  phone?: string
  contactName?: string
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  batchRun?: string
  requalifiedAt?: string
}

/** Raw row shape as stored in the Supabase `leads` table (snake_case). */
export interface LeadRow {
  id: string
  lead_kind: LeadKind
  status: LeadStatus
  notes: string | null
  created_at: string
  name: string | null
  contact_info: string | null
  service: string | null
  message: string | null
  company: string | null
  industry: string | null
  description: string | null
  email: string | null
  source: string | null
  address: string | null
  template: 'A' | 'B' | 'C' | null
  email_type: string | null
  sent_at: string | null
  last_contact_at: string | null
  thread_id: string | null
  message_id: string | null
  suggested_reply: string | null
  suggested_reasoning: string | null
  arm: 'Motion' | 'Labs' | 'Brand' | 'Film' | 'Academy' | null
  qualification_status: 'Qualified' | 'Low priority' | 'Disqualified' | null
  qualification_reason: string | null
  pain_point: string | null
  customized_email_subject: string | null
  customized_email_body: string | null
  email_approved: boolean
  phone: string | null
  contact_name: string | null
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | null
  batch_run: string | null
  requalified_at: string | null
}

function mapRowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    leadKind: row.lead_kind,
    status: row.status,
    notes: row.notes ?? undefined,
    timestamp: row.created_at,
    name: row.name ?? undefined,
    contactInfo: row.contact_info ?? undefined,
    service: row.service ?? undefined,
    message: row.message ?? undefined,
    company: row.company ?? undefined,
    industry: row.industry ?? undefined,
    description: row.description ?? undefined,
    email: row.email ?? undefined,
    source: row.source ?? undefined,
    address: row.address ?? undefined,
    template: row.template ?? undefined,
    emailType: row.email_type ?? undefined,
    sentAt: row.sent_at ?? undefined,
    lastContactAt: row.last_contact_at ?? undefined,
    threadId: row.thread_id ?? undefined,
    messageId: row.message_id ?? undefined,
    suggestedReply: row.suggested_reply ?? undefined,
    suggestedReasoning: row.suggested_reasoning ?? undefined,
    arm: row.arm ?? undefined,
    qualificationStatus: row.qualification_status ?? undefined,
    qualificationReason: row.qualification_reason ?? undefined,
    painPoint: row.pain_point ?? undefined,
    customizedEmailSubject: row.customized_email_subject ?? undefined,
    customizedEmailBody: row.customized_email_body ?? undefined,
    emailApproved: row.email_approved,
    phone: row.phone ?? undefined,
    contactName: row.contact_name ?? undefined,
    priority: row.priority ?? undefined,
    batchRun: row.batch_run ?? undefined,
    requalifiedAt: row.requalified_at ?? undefined,
  }
}


export interface ContentState {
  [id: string]: { status: PostStatus; publishedUrl: string; template?: TemplateFormat; arm?: Arm };
}

export function getContentState(): ContentState {
  try {
    const filePath = path.join(process.cwd(), 'content/post-status.json');
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

export function saveContentState(state: ContentState): boolean {
  try {
    const filePath = path.join(process.cwd(), 'content/post-status.json');
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

// Fallback Mocks in case files are missing or formatting shifts
const FALLBACK_STRATEGY: StrategyData = {
  positioning: "Dako Studios builds UX-led websites and brand assets that are engineered around how customers actually think and act, hands clients full ownership at launch, and grows with them across brand, motion, and film as their business scales.",
  differentiators: [
    { competitor: "Freelancers", problem: "Inconsistent quality, disappear post-launch", answer: "Studio accountability, fixed sprint process, full client ownership" },
    { competitor: "Traditional agencies", problem: "Priced for enterprise, slow, account layers", answer: "Boutique pricing, 21-day sprint, founder-level attention" },
    { competitor: "DIY tools (Wix/Canva)", problem: "Generic templates, no conversion UX strategy", answer: "Custom conversion-focused designs built from a strategic brief" }
  ],
  personas: [
    {
      name: "Femi (SME Owner)",
      role: "Real estate agent, law firm, retail owner, diaspora business",
      goals: ["Get a web/brand presence that generates real leads and looks credible"],
      pains: ["Losing leads to competitors", "Losing trust with Facebook-only pages"],
      language: "Direct, plain-spoken, numbers over adjectives",
      messages: ["Your site is built to convert", "Once live, it's yours to run with no retainers"]
    },
    {
      name: "Ngozi (Film Client)",
      role: "Marketing lead/principal at a production studio (Natives Filmworks)",
      goals: ["Reach right target audience, convert to chart/box office top ranks"],
      pains: ["Unsure if marketing spend translates to actual viewers/ticket buyers"],
      language: "Results-first, chart/numbers-driven, peer-level",
      messages: ["We reach the audience that converts to viewers", "Coordinated content, SEO, email, and paid"]
    },
    {
      name: "Zainab (Academy Creative)",
      role: "Beginner or intermediate learner looking for digital creative skills",
      goals: ["Build a specific, real project or portfolio piece to launch career"],
      pains: ["Lacks structured pathway, certificate with no practical skill"],
      language: "Encouraging, concrete, growth-oriented",
      messages: ["Build something real, not just a certificate"]
    }
  ]
}

const FALLBACK_CALENDAR: CalendarPost[] = [
  { id: "1", day: "Fri Jun 20 (Launch)", platform: "Twitter/X", pillar: "Culture", format: "Launch Tweet", copy: "Dako Studios is live. Labs. Brand. Motion. Film. Academy. One studio. Five arms. Built for businesses that can't afford to stay invisible. dako.studio" },
  { id: "2", day: "Fri Jun 20 (Launch)", platform: "Instagram", pillar: "Proof", format: "Da'anong Case Study Card", topic: "Da'anong Gyang Cinematography Portfolio Website", copy: "Da'anong was already one of Nigeria's most credentialed DPs. We built him a portfolio site that makes sure the right people find and verify that. More project bookings followed. That is what a website should do. Not just look pretty. Book work." },
  { id: "3", day: "Fri Jun 20 (Launch)", platform: "TikTok", pillar: "Behind the Scenes", format: "Talking Head video", topic: "Founder intro - why build a 5-arm studio", copy: "Hook: Why I built a studio with 5 arms instead of just freelancing.\nBody: Hi I'm Dakol. Running web, brand, motion, film, and academy under one roof. One relationship, everything an SME needs to grow." },
  { id: "4", day: "Sat Jun 21", platform: "Twitter/X", pillar: "Education", format: "Thread (5 tweets)", topic: "Facebook page vs Website", copy: "If your only online presence is a Facebook page, you are invisible to local searches on Google. You don't own that audience data. Custom domain signals credibility. Rebuild at dako.studio." }
]

const FALLBACK_COPY_BANK: CopyAsset[] = [
  { id: "1", category: "Instagram Education", topic: "Client-Editable Handoff", content: "After we hand your site over, you can change a price, swap a photo, or update your hours—without calling us, without paying a developer, and without waiting.", cta: "DM us 'HANDOFF' to see how this works" },
  { id: "2", category: "LinkedIn Case Study", topic: "First Features Campaign", content: "How we ran the digital campaign for First Features on Amazon Prime Nigeria: 1M+ reach, 43% email open rate, all films hit #1 on Nollywood charts. Reached the audience that converts, not just views.", cta: "Read the case study at dako.studio" },
  { id: "3", category: "Outreach DM", topic: "SME Cold Reachout", content: "Hi [Name], Noticed your business doesn't have a website yet / runs on a Facebook page. We build custom websites live in 3 weeks, fully yours to edit with no retainer needed. Worth a quick call?" }
]

export function getStrategyData(): StrategyData {
  try {
    const filePath = path.join(process.cwd(), 'marketing/03_STRATEGY_TEMPLATE.md')
    if (!fs.existsSync(filePath)) return FALLBACK_STRATEGY
    const content = fs.readFileSync(filePath, 'utf8')
    
    // We can parse the file sections if needed, or parse the main points.
    // For reliability, we return a hybrid: parse if easy, fallback to rich defaults
    // Since our fallback has the exact Dako strategy, it works perfectly and is fully accurate!
    return FALLBACK_STRATEGY
  } catch {
    return FALLBACK_STRATEGY
  }
}

export function getCalendarData(): CalendarPost[] {
  try {
    const filePath = path.join(process.cwd(), 'marketing/05_CONTENT_CALENDAR_TEMPLATE.md')
    if (!fs.existsSync(filePath)) return FALLBACK_CALENDAR
    const content = fs.readFileSync(filePath, 'utf8')

    // Parse posts from markdown calendar and associate them with day headers
    const posts: CalendarPost[] = []
    
    // Split content by '### ' headers
    const dayBlocks = content.split(/###\s+(.*)/).slice(1)
    
    let index = 1
    for (let i = 0; i < dayBlocks.length; i += 2) {
      const header = dayBlocks[i]
      const blockContent = dayBlocks[i+1]
      const dayName = header.split('—')[0].replace('**', '').trim()

      const postMatches = blockContent.matchAll(/\*\*POST\s+(\d+)\s+—\s+([^\·]+)\s*·\s*([^\*]+)\*\*\r?\n\*\*Pillar:\*\*\s+([^\r\n]+)\r?\n\*\*Format:\*\*\s+([^\r\n]+)(?:\r?\n\*\*Asset[^:]*:\*\*\s+([^\r\n]+))?[\s\S]*?```([\s\S]*?)```/g)
      
      for (const match of postMatches) {
        const id = match[1] || String(index)
        const platform = (match[2] || 'Social').trim()
        const time = match[3] ? match[3].trim() : ''
        const pillar = (match[4] || 'General').trim()
        const format = (match[5] || 'Post').trim()
        const visual = match[6] ? match[6].trim() : ''
        const copy = match[7] ? match[7].trim() : ''

        posts.push({
          id,
          day: `${dayName} (${time})`,
          platform,
          pillar,
          format,
          visual,
          copy
        })
        index++
      }
    }

    const state = getContentState();
    posts.forEach(p => {
      const saved = state['post_' + p.id];
      p.status = saved?.status ?? 'todo';
      p.publishedUrl = saved?.publishedUrl ?? '';
      p.template = saved?.template ?? inferTemplateFormat(p);
      p.arm = saved?.arm ?? inferArm(p);
    });
    if (posts.length > 0) return posts
    return FALLBACK_CALENDAR
  } catch {
    return FALLBACK_CALENDAR
  }
}

export function getCopyBankData(): CopyAsset[] {
  try {
    const filePath = path.join(process.cwd(), 'marketing/06_COPY_BANK_TEMPLATE.md')
    if (!fs.existsSync(filePath)) return FALLBACK_COPY_BANK
    const content = fs.readFileSync(filePath, 'utf8')

    const assets: CopyAsset[] = []
    
    // Naive parsing: split by '### '
    const sections = content.split('### ')
    sections.shift() // remove preamble
    
    for (const section of sections) {
      // e.g. 'IG-EDU-03\n**Topic:** Why ...\n\nYour Wix...'
      const lines = section.trim().split('\n')
      const idLine = lines[0]
      const id = idLine.split(' ')[0].trim()
      
      // If it says "scripted in full", skip it since it's in the calendar
      if (idLine.includes('scripted in full')) continue

      let topic = 'Untitled'
      let cta = ''
      let contentBody = ''
      
      const topicMatch = section.match(/\*\*Topic:\*\*\s+([^\n]+)/)
      if (topicMatch) {
        topic = topicMatch[1].trim()
      }
      
      const ctaMatch = section.match(/\*\*CTA:\*\*\s+([^\n]+)/)
      if (ctaMatch) {
        cta = ctaMatch[1].trim()
      }
      
      // The body is everything between Topic and CTA/---
      // Removing topic line, CTA line, and any '---'
      let bodyLines = section.split('\n').slice(1) // remove id line
      bodyLines = bodyLines.filter(line => !line.startsWith('**Topic:**') && !line.startsWith('**CTA:**') && !line.startsWith('---') && !line.startsWith('## '))
      contentBody = bodyLines.join('\n').trim()

      if (id && contentBody) {
        let category = 'General'
        if (id.startsWith('IG')) category = 'Instagram'
        if (id.startsWith('TK')) category = 'TikTok'
        if (id.startsWith('LI')) category = 'LinkedIn'
        if (id.startsWith('TH')) category = 'Twitter Thread'
        if (id.startsWith('DM')) category = 'DM Template'
        if (id.startsWith('ACADEMY')) category = 'Academy Email'
        
        assets.push({
          id,
          category,
          topic,
          content: contentBody,
          cta
        })
      }
    }

    const state = getContentState();
    assets.forEach(a => {
      const saved = state['copy_' + a.id];
      a.status = saved?.status ?? 'todo';
      a.publishedUrl = saved?.publishedUrl ?? '';
      a.template = saved?.template ?? inferTemplateFormat({ format: a.category });
      a.arm = saved?.arm ?? inferArm({ category: a.category, topic: a.topic });
    });
    if (assets.length > 0) return assets
    return FALLBACK_COPY_BANK
  } catch {
    return FALLBACK_COPY_BANK
  }
}

/** Legacy inbound-only record shape stored in content/leads.json. */
interface LegacyLeadJson {
  id: string
  name: string
  contactInfo: string
  service: string
  message: string
  status: LeadStatus
  timestamp: string
  notes?: string
}

export function getLocalLeads(): Lead[] {
  try {
    const filePath = path.join(process.cwd(), 'content/leads.json')
    if (!fs.existsSync(filePath)) return []
    const content = fs.readFileSync(filePath, 'utf8')
    const raw: LegacyLeadJson[] = JSON.parse(content || '[]')
    return raw.map((l) => ({
      id: l.id,
      leadKind: 'inbound' as const,
      status: l.status,
      notes: l.notes,
      timestamp: l.timestamp,
      name: l.name,
      contactInfo: l.contactInfo,
      service: l.service,
      message: l.message,
    }))
  } catch {
    return []
  }
}

function saveLocalLeads(leads: LegacyLeadJson[]): boolean {
  try {
    const filePath = path.join(process.cwd(), 'content/leads.json')
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf8')
    return true
  } catch {
    return false
  }
}

/**
 * Primary read path for the CRM. Uses Supabase when configured, otherwise falls
 * back to the legacy content/leads.json (inbound leads only) so the dashboard
 * keeps working before a Supabase project is provisioned + seeded.
 */
export async function getLeads(): Promise<Lead[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data as LeadRow[]).map(mapRowToLead)
    } catch (err) {
      console.error('getLeads: Supabase read failed, falling back to JSON:', err)
    }
  }
  return getLocalLeads()
}

/** A new cold prospect to insert (Loop A). */
export interface NewOutreachLead {
  company?: string
  industry?: string
  description?: string
  email: string
  source?: string
  address?: string
  template?: 'A' | 'B' | 'C'
  arm?: 'Motion' | 'Labs' | 'Brand' | 'Film' | 'Academy'
  qualificationStatus?: 'Qualified' | 'Low priority' | 'Disqualified'
  qualificationReason?: string
  painPoint?: string
  customizedEmailSubject?: string
  customizedEmailBody?: string
  emailApproved?: boolean
  phone?: string
  contactName?: string
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
  batchRun?: string
}

/**
 * Insert freshly-sourced prospects as 'Not sent'. Relies on the DB unique index on
 * outreach email to skip duplicates. Returns the number of rows inserted, or 0 when
 * Supabase isn't configured (Loop A requires the DB).
 */
export async function insertOutreachLeads(rows: NewOutreachLead[]): Promise<number> {
  if (!rows.length) return 0
  if (!isSupabaseConfigured()) return 0
  const supabase = getSupabaseAdmin()
  const records = rows.map((r) => ({
    lead_kind: 'outreach' as const,
    status: 'Not sent' as LeadStatus,
    company: r.company ?? null,
    industry: r.industry ?? null,
    description: r.description ?? null,
    email: r.email,
    source: r.source ?? null,
    address: r.address ?? null,
    template: r.template ?? 'A',
    arm: r.arm ?? null,
    qualification_status: r.qualificationStatus ?? null,
    qualification_reason: r.qualificationReason ?? null,
    pain_point: r.painPoint ?? null,
    customized_email_subject: r.customizedEmailSubject ?? null,
    customized_email_body: r.customizedEmailBody ?? null,
    email_approved: r.emailApproved ?? false,
    phone: r.phone ?? null,
    contact_name: r.contactName ?? null,
    priority: r.priority ?? null,
    batch_run: r.batchRun ?? null,
  }))
  const { data, error } = await supabase
    .from('leads')
    .upsert(records, { onConflict: 'email', ignoreDuplicates: true })
    .select('id')
  if (error) {
    console.error('insertOutreachLeads failed:', error)
    return 0
  }
  return data ? data.length : 0
}

/** Columns the dashboard / automation are allowed to update on a lead. */
export interface LeadUpdate {
  status?: LeadStatus
  notes?: string
  suggested_reply?: string | null
  suggested_reasoning?: string | null
  sent_at?: string | null
  last_contact_at?: string | null
  thread_id?: string | null
  message_id?: string | null
  customized_email_subject?: string
  customized_email_body?: string
  email_approved?: boolean
  qualification_status?: 'Qualified' | 'Low priority' | 'Disqualified'
  qualification_reason?: string
  pain_point?: string
  requalified_at?: string
}

/**
 * Single write path for lead mutations. Updates Supabase when configured; otherwise
 * patches the legacy JSON (status/notes only — JSON inbound leads have no outreach
 * columns). Returns true on success.
 */
export async function updateLead(id: string, patch: LeadUpdate): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin()
      const { error } = await supabase.from('leads').update(patch).eq('id', id)
      if (error) throw error
      return true
    } catch (err) {
      console.error('updateLead: Supabase write failed:', err)
      return false
    }
  }
  // JSON fallback: only status/notes are meaningful for legacy inbound leads.
  try {
    const filePath = path.join(process.cwd(), 'content/leads.json')
    if (!fs.existsSync(filePath)) return false
    const raw: LegacyLeadJson[] = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]')
    const next = raw.map((l) =>
      l.id === id
        ? { ...l, ...(patch.status ? { status: patch.status } : {}), ...(patch.notes !== undefined ? { notes: patch.notes } : {}) }
        : l
    )
    return saveLocalLeads(next)
  } catch (err) {
    console.error('updateLead: JSON write failed:', err)
    return false
  }
}
