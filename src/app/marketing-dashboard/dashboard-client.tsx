"use client"

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Calendar as CalendarIcon,
  Copy,
  Check,
  Users,
  ShieldCheck,
  Search,
  BookOpen,
  MessageSquare,
  Clock,
  Send,
  AlertCircle,
  ArrowRight,
  LogOut,
  TextAlignJustify,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  Eye,
  Download,
  Wallet,
  TrendingUp,
  Sparkles,
  Maximize2
} from 'lucide-react'
import { StrategyData, CalendarPost, CopyAsset, Lead } from '@/utils/marketing-data'
import { Invoice } from '@/utils/invoices'
import { TemplateRenderer } from '@/components/social-templates/TemplateRenderer'
import { TEMPLATE_FORMATS, ARMS, type TemplateFormat, type Arm } from '@/utils/social-templates'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { DakoLogo } from '@/components/dako-logo'
import { ModeToggle } from '@/components/mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DashboardClientProps {
  strategy: StrategyData
  calendar: CalendarPost[]
  copyBank: CopyAsset[]
  leads: Lead[]
}

export function DashboardClient({ strategy, calendar, copyBank, leads }: DashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'strategy' | 'calendar' | 'copybank' | 'crm'>('strategy')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Calendar Drawer & View State
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null)
  const [calendarSubView, setCalendarSubView] = useState<'calendar' | 'kanban' | 'list'>('kanban')
  const [calFilterPlatform, setCalFilterPlatform] = useState('all')
  const [calFilterPillar, setCalFilterPillar] = useState('all')
  
  // Realtime state
  const [livePosts, setLivePosts] = useState<CalendarPost[]>(calendar)
  const [liveCopy, setLiveCopy] = useState<CopyAsset[]>(copyBank)
  const [copyMonth, setCopyMonth] = useState<number>(1)

  const updatePostStatus = async (id: string, status: any) => {
    setLivePosts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    if (selectedPost?.id === id) setSelectedPost({ ...selectedPost, status })
    await fetch('/api/marketing/status', {
      method: 'POST',
      body: JSON.stringify({ id, type: 'post', status })
    })
  }

  const updateCopyStatus = async (id: string, status: any) => {
    setLiveCopy(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    await fetch('/api/marketing/status', {
      method: 'POST',
      body: JSON.stringify({ id, type: 'copy', status })
    })
  }

  // Visual template preview/export — shared by Content Calendar + Copy Bank
  const [previewItem, setPreviewItem] = useState<{ type: 'post' | 'copy'; id: string; template: TemplateFormat; arm: Arm } | null>(null)

  const updatePostTemplate = async (id: string, template: TemplateFormat, arm: Arm) => {
    setLivePosts(prev => prev.map(p => p.id === id ? { ...p, template, arm } : p))
    if (selectedPost?.id === id) setSelectedPost({ ...selectedPost, template, arm })
    await fetch('/api/marketing/status', {
      method: 'POST',
      body: JSON.stringify({ id, type: 'post', template, arm })
    })
  }

  const updateCopyTemplate = async (id: string, template: TemplateFormat, arm: Arm) => {
    setLiveCopy(prev => prev.map(c => c.id === id ? { ...c, template, arm } : c))
    await fetch('/api/marketing/status', {
      method: 'POST',
      body: JSON.stringify({ id, type: 'copy', template, arm })
    })
  }

  // Copy Bank State
  const [copySearch, setCopySearch] = useState('')
  const [selectedCopyCategory, setSelectedCopyCategory] = useState('All')

  // CRM State
  const [crmLeads, setCrmLeads] = useState<Lead[]>(leads)
  const [crmFilter, setCrmFilter] = useState<string>('All')
  const [crmKind, setCrmKind] = useState<'all' | 'outreach' | 'inbound'>('all')
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null)
  // Local in-progress edits to a lead's drafted email, keyed by lead id, before Approve persists them
  const [emailDrafts, setEmailDrafts] = useState<Record<string, { subject: string; body: string }>>({})

  // Invoicing state — a lead being marked 'Closed' opens the Create Invoice modal
  const [invoiceModalLead, setInvoiceModalLead] = useState<Lead | null>(null)
  const [invoiceClientName, setInvoiceClientName] = useState('')
  const [invoiceClientEmail, setInvoiceClientEmail] = useState('')
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; quantity: number; unitPrice: number }[]>([])
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [invoiceSaving, setInvoiceSaving] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoaded, setInvoicesLoaded] = useState(false)
  const [invoiceActionId, setInvoiceActionId] = useState<string | null>(null)
  const [pdfLoadingId, setPdfLoadingId] = useState<string | null>(null)

  // Detail panels — clicking a lead or invoice opens its full-detail Sheet
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const loadInvoices = async () => {
    try {
      const res = await fetch('/api/marketing/invoices')
      if (!res.ok) throw new Error('load failed')
      const data = await res.json()
      setInvoices(data.invoices ?? [])
    } catch {
      // leave existing invoices list untouched on failure
    } finally {
      setInvoicesLoaded(true)
    }
  }

  useEffect(() => {
    if (activeTab === 'crm' && !invoicesLoaded) {
      loadInvoices()
    }
  }, [activeTab, invoicesLoaded])

  const openInvoiceModal = (lead: Lead) => {
    setInvoiceModalLead(lead)
    setInvoiceClientName(lead.company || lead.name || '')
    setInvoiceClientEmail(lead.email || lead.contactInfo || '')
    setInvoiceItems([{ description: lead.service || 'Project work', quantity: 1, unitPrice: 0 }])
    setInvoiceNotes('')
  }

  const updateInvoiceItem = (index: number, patch: Partial<{ description: string; quantity: number; unitPrice: number }>) => {
    setInvoiceItems(prev => prev.map((item, i) => i === index ? { ...item, ...patch } : item))
  }

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }])
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreateInvoice = async () => {
    if (!invoiceModalLead) return
    setInvoiceSaving(true)
    try {
      const res = await fetch('/api/marketing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: invoiceModalLead.id,
          clientName: invoiceClientName || undefined,
          clientEmail: invoiceClientEmail || undefined,
          items: invoiceItems.filter(i => i.description.trim()),
          notes: invoiceNotes || undefined,
        })
      })
      if (!res.ok) throw new Error('create failed')
      const data = await res.json()
      if (data.invoice) setInvoices(prev => [data.invoice, ...prev])
      setInvoiceModalLead(null)
    } catch {
      // surface nothing destructive — the modal stays open so the user can retry
    } finally {
      setInvoiceSaving(false)
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    setInvoiceActionId(invoiceId)
    try {
      const res = await fetch(`/api/marketing/invoices/${invoiceId}/send`, { method: 'POST' })
      if (!res.ok) throw new Error('send failed')
      const data = await res.json()
      if (!data.dryRun) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Sent', sentAt: data.sentAt } : inv))
      }
    } catch {
      // no optimistic state was set for send — nothing to revert
    } finally {
      setInvoiceActionId(null)
    }
  }

  const handleMarkInvoicePaid = async (invoiceId: string) => {
    const prevInvoices = invoices
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv))
    setInvoiceActionId(invoiceId)
    try {
      const res = await fetch(`/api/marketing/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      })
      if (!res.ok) throw new Error('update failed')
    } catch {
      setInvoices(prevInvoices)
    } finally {
      setInvoiceActionId(null)
    }
  }

  // pdf_path is a private Storage path — fetch a short-lived signed URL to view/download it
  const handleViewPdf = async (invoiceId: string) => {
    setPdfLoadingId(invoiceId)
    try {
      const res = await fetch(`/api/marketing/invoices/${invoiceId}/pdf`)
      if (!res.ok) throw new Error('pdf fetch failed')
      const data = await res.json()
      if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch {
      // no PDF stored yet — the button is disabled in that case, this only covers transient failures
    } finally {
      setPdfLoadingId(null)
    }
  }

  // Avatar background per service arm, per DESIGN.md's arm accent table
  const armAvatarColor = (arm?: Lead['arm']) => {
    switch (arm) {
      case 'Motion': return '#E84C00'
      case 'Labs': return '#4A7C96'
      case 'Brand': return '#C9A227'
      case 'Film': return '#3D5470'
      case 'Academy': return '#C1272D'
      default: return undefined
    }
  }

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Update lead pipeline status — optimistic UI + persist to the DB (single write path)
  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    const prevLeads = crmLeads
    setCrmLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    setSavingLeadId(leadId)
    try {
      const res = await fetch('/api/marketing/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus })
      })
      if (!res.ok) throw new Error('save failed')
      // Closing a lead is the trigger for invoicing — open the Create Invoice panel
      // for a human to fill in real line-item amounts (never auto-billed).
      if (newStatus === 'Closed') {
        const closedLead = crmLeads.find(l => l.id === leadId)
        if (closedLead) openInvoiceModal({ ...closedLead, status: newStatus })
      }
    } catch {
      // revert on failure so the UI never lies about persisted state
      setCrmLeads(prevLeads)
    } finally {
      setSavingLeadId(null)
    }
  }

  // Approve (and optionally persist edits to) a drafted outreach email — same optimistic pattern as handleStatusChange
  const handleApproveEmail = async (leadId: string) => {
    const prevLeads = crmLeads
    const draft = emailDrafts[leadId]
    const lead = crmLeads.find(l => l.id === leadId)
    const edited = draft && lead && (draft.subject !== lead.customizedEmailSubject || draft.body !== lead.customizedEmailBody)
    const patch = {
      id: leadId,
      email_approved: true,
      ...(edited ? { customized_email_subject: draft.subject, customized_email_body: draft.body } : {})
    }
    setCrmLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      emailApproved: true,
      ...(edited ? { customizedEmailSubject: draft.subject, customizedEmailBody: draft.body } : {})
    } : l))
    setSavingLeadId(leadId)
    try {
      const res = await fetch('/api/marketing/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      })
      if (!res.ok) throw new Error('save failed')
    } catch {
      // revert on failure so the UI never lies about persisted state
      setCrmLeads(prevLeads)
    } finally {
      setSavingLeadId(null)
    }
  }

  const handleLogout = () => {
    document.cookie = 'dako_marketing_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.refresh()
  }

  // Copy categories
  const copyCategories = useMemo(() => {
    const cats = new Set(copyBank.map(asset => asset.category))
    return ['All', ...Array.from(cats)]
  }, [copyBank])

  // Filtered Calendar Posts
  const filteredPosts = useMemo(() => {
    return livePosts.filter(p => {
      const matchPlat = calFilterPlatform === 'all' || p.platform === calFilterPlatform
      const matchPill = calFilterPillar === 'all' || p.pillar === calFilterPillar
      return matchPlat && matchPill
    })
  }, [livePosts, calFilterPlatform, calFilterPillar])

  // Calendar Platforms
  const calPlatforms = useMemo(() => Array.from(new Set(livePosts.map(p => p.platform))), [livePosts])
  const calPillars = useMemo(() => Array.from(new Set(livePosts.map(p => p.pillar))), [livePosts])

  // Progress metrics
  const donePosts = livePosts.filter(p => p.status === 'done').length
  const totalPosts = livePosts.length
  const progressPct = totalPosts ? Math.round((donePosts / totalPosts) * 100) : 0

  // Filtered copy bank
  const filteredCopyBank = useMemo(() => {
    return liveCopy.filter(asset => {
      const matchesCategory = selectedCopyCategory === 'All' || asset.category === selectedCopyCategory
      const matchesSearch = 
        asset.topic.toLowerCase().includes(copySearch.toLowerCase()) ||
        asset.content.toLowerCase().includes(copySearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [liveCopy, selectedCopyCategory, copySearch])

  // Filtered CRM Leads
  const filteredLeads = useMemo(() => {
    return crmLeads.filter(l => {
      const matchKind = crmKind === 'all' || l.leadKind === crmKind
      const matchStatus = crmFilter === 'All'
        || (crmFilter === 'Awaiting approval' ? Boolean(l.customizedEmailBody) && !l.emailApproved : l.status === crmFilter)
      return matchKind && matchStatus
    })
  }, [crmLeads, crmFilter, crmKind])

  // Status chips shown depend on which pipeline (kind) is active
  const OUTREACH_STATUSES = ['Not sent', 'Sent', 'Bumped', 'Replied', 'Proposal Sent', 'Closed', 'Lost', 'Breakup sent']
  const INBOUND_STATUSES = ['Identified', 'Contacted', 'Proposal Sent', 'Closed', 'Lost']
  const crmFilterChips = ['All', ...(crmKind === 'inbound' ? INBOUND_STATUSES : OUTREACH_STATUSES), 'Awaiting approval']

  // Leads with a drafted email still pending human approval (qualification engine output)
  const awaitingApprovalCount = crmLeads.filter(l => l.customizedEmailBody && !l.emailApproved).length

  // Replies awaiting human review are the actionable signal for the badge
  const repliesToReview = crmLeads.filter(l => l.status === 'Replied').length

  // CRM KPI row — computed from already-loaded leads/invoices state, no extra fetch
  const crmKpis = useMemo(() => {
    const closedDeals = crmLeads.filter(l => l.status === 'Closed').length
    const revenueCollected = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0)
    const revenueOutstanding = invoices.filter(i => i.status === 'Sent').reduce((sum, i) => sum + i.total, 0)
    return { totalLeads: crmLeads.length, awaitingApproval: awaitingApprovalCount, closedDeals, revenueCollected, revenueOutstanding }
  }, [crmLeads, invoices, awaitingApprovalCount])

  const selectedLead = useMemo(() => crmLeads.find(l => l.id === selectedLeadId) ?? null, [crmLeads, selectedLeadId])
  const selectedInvoice = useMemo(() => invoices.find(i => i.id === selectedInvoiceId) ?? null, [invoices, selectedInvoiceId])
  const selectedLeadInvoices = useMemo(
    () => (selectedLeadId ? invoices.filter(i => i.leadId === selectedLeadId) : []),
    [invoices, selectedLeadId]
  )

  const tabs: { id: string, label: string, icon: any, badge?: number }[] = [
    { id: 'strategy', label: 'Strategy Board', icon: Briefcase },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarIcon },
    { id: 'copybank', label: 'Copy Bank', icon: MessageSquare },
    { id: 'crm', label: 'Lead CRM', icon: Users, badge: repliesToReview || undefined }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar matching root style */}
      <header className="sticky top-0 z-50 w-full transition-all duration-500 bg-background/80 backdrop-blur-xl border-b border-border/20 py-0">
        <div className="w-full px-4 sm:px-6">
          <nav className="w-full flex items-center justify-between gap-3.5 lg:gap-6 transition-all duration-500 max-w-7xl mx-auto py-4 bg-transparent border-transparent">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 cursor-pointer">
              <DakoLogo size={28} />
            </Link>

            {/* Desktop Navigation Tabs */}
            <div className="max-lg:hidden bg-muted p-0.5 rounded-full flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-2 lg:px-4 py-2 text-sm font-medium rounded-full outline outline-transparent transition tracking-normal cursor-pointer flex items-center gap-1.5 relative",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-xs outline-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-background hover:outline-border hover:shadow-xs"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5 hidden xl:block" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop CTA & Theme Toggle */}
            <div className="hidden lg:flex items-center gap-4">
              <ModeToggle variant="ghost" />
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="rounded-full h-10 px-6 font-medium bg-destructive hover:bg-destructive/90 transition-all text-destructive-foreground shadow-xs flex items-center gap-2"
              >
                <span>Logout</span>
                <LogOut size={16} />
              </Button>
            </div>

            {/* Mobile Menu & Theme Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <ModeToggle variant="ghost" />
              <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
                  <TextAlignJustify size={20} />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  {tabs.map((tab) => (
                    <DropdownMenuItem key={tab.id} asChild>
                      <button
                        onClick={() => {
                          setActiveTab(tab.id as any)
                          setIsMobileMenuOpen(false)
                        }}
                        className={cn(
                          "w-full cursor-pointer text-sm font-medium px-2 py-1.5 flex items-center justify-between",
                          activeTab === tab.id && "text-primary"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && tab.badge > 0 && (
                          <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    </DropdownMenuItem>
                  ))}
                  <div className="border-t border-border/40 mt-1 pt-1.5 px-1">
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full cursor-pointer text-sm font-semibold text-destructive px-2 py-1.5 flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 pt-12 pb-24">
        
        {/* Title Area */}
        <div className="flex flex-col gap-2 border-b border-border pb-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-primary uppercase">
            <ShieldCheck className="h-4 w-4" />
            <span>Internal Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground">
            Marketing OS &amp; Lead Center
          </h1>
        </div>

      {/* Tab content 1: Strategy Board */}
        {activeTab === 'strategy' && (
          <div className="grid gap-8">
            {/* Core positioning & differentiators */}
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="lg:col-span-2 border border-border bg-card/60 backdrop-blur-md rounded-[8px]">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold text-foreground">Brand Positioning Statement</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-light">Seed Category: UX-led Creative Studio for Small Businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-foreground font-light leading-relaxed italic border-l-2 border-primary pl-4">
                    "{strategy.positioning}"
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px]">
                <CardHeader>
                  <CardTitle className="font-display text-xl font-bold text-foreground">Brand Voice Core</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-light">Principles we communicate with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5 text-sm font-light text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary font-semibold">1. Directness:</span>
                    <span className="text-foreground">No vendor jargon; peer-to-peer business talk.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-semibold">2. Specificity:</span>
                    <span className="text-foreground">Numbers over adjectives (#1 Prime Video).</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-semibold">3. Transparency:</span>
                    <span className="text-foreground">Show the draft work, wireframes, and process.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-semibold">4. Confidence:</span>
                    <span className="text-foreground">No hedging; let the UX engineering back the claims.</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitor analysis differentiators */}
            <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px]">
              <CardHeader>
                <CardTitle className="font-display text-xl font-bold text-foreground">Competitive Differentiation Map</CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-light">Why we beat other creative options</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Competitor Type</th>
                      <th className="py-3 px-4">Their Problem</th>
                      <th className="py-3 px-4 text-primary">Dako Studios Answer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 font-light text-muted-foreground">
                    {strategy.differentiators.map((diff, idx) => (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-4 font-semibold text-foreground">{diff.competitor}</td>
                        <td className="py-4 px-4 text-foreground">{diff.problem}</td>
                        <td className="py-4 px-4 text-foreground font-semibold">{diff.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Target Personas */}
            <div className="grid gap-8 md:grid-cols-3">
              {strategy.personas.map((persona, idx) => (
                <Card key={idx} className="border border-border bg-card/60 backdrop-blur-md rounded-[8px] flex flex-col justify-between">
                  <CardHeader className="border-b border-border/15 pb-4">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Persona {idx + 1}</span>
                    </div>
                    <CardTitle className="font-display text-lg font-bold text-foreground">{persona.name}</CardTitle>
                    <CardDescription className="text-xs font-light text-muted-foreground">{persona.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 text-xs font-light text-muted-foreground flex-grow">
                    <div>
                      <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-1.5">Core Goal</h4>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {persona.goals.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-1.5">Primary Pain</h4>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {persona.pains.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-1.5">Communication Style</h4>
                      <p className="text-foreground">{persona.language}</p>
                    </div>
                    <div className="bg-primary/5 p-3 rounded-[4px] border border-primary/10">
                      <h4 className="font-semibold text-primary uppercase tracking-wider text-[10px] mb-1">Core Pitch Message</h4>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {persona.messages.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab content 2: Interactive Content Calendar */}
        {activeTab === 'calendar' && (
          <div className="grid gap-8">
            {/* Calendar Controls & Progress */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/60 backdrop-blur-md p-5 border border-border rounded-[8px]">
              
              <div className="flex flex-col gap-2 flex-grow min-w-[200px] max-w-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground"><strong className="text-primary font-semibold">{donePosts}</strong> / {totalPosts} posts published</span>
                  <span className="text-primary font-bold">{progressPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:ml-auto">
                <select value={calFilterPlatform} onChange={(e) => setCalFilterPlatform(e.target.value)} className="bg-background/50 border border-border rounded-[4px] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary">
                  <option value="all">Platform: All</option>
                  {calPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={calFilterPillar} onChange={(e) => setCalFilterPillar(e.target.value)} className="bg-background/50 border border-border rounded-[4px] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary">
                  <option value="all">Pillar: All</option>
                  {calPillars.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="flex bg-background/50 border border-border rounded-[4px] overflow-hidden ml-2">
                  {['calendar', 'kanban', 'list'].map(view => (
                    <button
                      key={view}
                      onClick={() => setCalendarSubView(view as any)}
                      className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${calendarSubView === view ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 items-start">
              
              {/* Main View Area */}
              <div className="lg:col-span-2">
                {calendarSubView === 'calendar' ? (
                  <div className="border border-border bg-card/40 rounded-[8px] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                      <h2 className="text-lg font-bold font-display text-foreground">June / July 2026</h2>
                    </div>
                    <div className="grid grid-cols-7 border-b border-border bg-muted/40">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                        <div key={d} className="p-2 text-[10px] font-bold text-muted-foreground tracking-wider uppercase border-r border-border last:border-r-0">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                      {/* Hardcode offset for June 15 start (Monday) to make grid align perfectly for the active period. June 15 is Monday. */}
                      {Array.from({length: 4}).map((_, i) => <div key={`pad-${i}`} className="border-r border-b border-border/50 bg-muted/10 p-2 opacity-50"></div>)}
                      {Array.from({length: 31}).map((_, i) => {
                        // Offset: June 19 is Friday. So June 15 is Monday.
                        // Let's render June 19 to July 19.
                        const dateNum = 19 + i;
                        const isJuly = dateNum > 30;
                        const displayDate = isJuly ? dateNum - 30 : dateNum;
                        const monthStr = isJuly ? 'July' : 'June';
                        
                        const dayPosts = filteredPosts.filter(p => new RegExp(`${monthStr} ${displayDate}\\b`).test(p.day));
                        
                        return (
                          <div key={i} className={`border-r border-b border-border p-2 flex flex-col gap-1.5 transition-colors hover:bg-muted/10 ${dayPosts.length > 0 ? 'bg-background' : 'bg-card/20'}`}>
                            <span className="text-xs font-semibold text-muted-foreground mb-1">{displayDate}</span>
                            {dayPosts.map(post => (
                              <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className={`p-1.5 rounded-[4px] cursor-pointer text-left border ${selectedPost?.id === post.id ? 'border-primary bg-primary/10' : 'border-border/60 bg-muted/30 hover:border-primary/50'}`}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Badge variant="outline" className={`text-[8px] px-1 py-0 uppercase border-primary/30 ${(post.status || 'todo') === 'done' ? 'text-emerald-400 border-emerald-400/30' : 'text-primary'}`}>
                                    {post.platform.substring(0, 2)}
                                  </Badge>
                                </div>
                                <p className={`text-[9px] leading-tight font-medium line-clamp-2 ${(post.status || 'todo') === 'done' ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}>
                                  {post.format}
                                </p>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : calendarSubView === 'kanban' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['todo', 'inprogress', 'done'].map(col => {
                      const colPosts = filteredPosts.filter(p => (p.status || 'todo') === col);
                      return (
                        <div key={col} className="bg-card/40 border border-border rounded-[8px] p-3 flex flex-col gap-3 min-h-[400px]">
                          <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <Badge variant="outline" className={`text-[10px] uppercase font-bold ${col === 'todo' ? 'text-muted-foreground' : col === 'inprogress' ? 'text-amber-400 border-amber-400/30' : 'text-emerald-400 border-emerald-400/30'}`}>
                              {col === 'todo' ? 'To Do' : col === 'inprogress' ? 'In Progress' : 'Done'}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-semibold">{colPosts.length}</span>
                          </div>
                          
                          <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
                            {colPosts.map(post => (
                              <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className={`p-3 bg-background border rounded-[6px] cursor-pointer transition-all ${selectedPost?.id === post.id ? 'border-primary ring-1 ring-primary/20' : 'border-border/60 hover:border-border'}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{post.platform}</span>
                                  <span className="text-[9px] text-muted-foreground">{post.day.split('(')[0].trim()}</span>
                                </div>
                                <h4 className="text-xs font-semibold text-foreground mb-1 leading-tight">{post.format}</h4>
                                <p className="text-[10px] text-muted-foreground line-clamp-2">{post.pillar}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px]">
                    <CardHeader>
                      <CardTitle className="font-display text-xl font-bold text-foreground">Month 1 List View</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filteredPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={`p-4 border rounded-[6px] cursor-pointer transition-all duration-300 flex items-center justify-between gap-4 ${
                            selectedPost?.id === post.id
                              ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                              : 'border-border/30 bg-background hover:bg-background/80 hover:border-border/60'
                          } ${post.status === 'done' ? 'opacity-60' : ''}`}
                        >
                          <div className="space-y-1.5 flex-grow">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">
                                {post.platform}
                              </Badge>
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {post.day}
                              </span>
                              <Badge variant="outline" className={`text-[9px] uppercase ${(post.status || 'todo') === 'todo' ? 'text-muted-foreground' : (post.status === 'inprogress') ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {post.status || 'todo'}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground leading-tight">
                              {post.format} — <span className="font-light text-muted-foreground">{post.pillar}</span>
                            </h3>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Selected Post Drawer/Detail Card */}
              <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px] sticky top-8">
                <CardHeader className="border-b border-border/15 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-display text-lg font-bold flex items-center gap-1.5 text-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>Draft Details</span>
                    </CardTitle>
                    {selectedPost && (
                      <select 
                        value={selectedPost.status || 'todo'} 
                        onChange={(e) => updatePostStatus(selectedPost.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-[4px] border focus:outline-none cursor-pointer ${selectedPost.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : selectedPost.status === 'inprogress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-muted/30 text-muted-foreground border-border'}`}
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    )}
                  </div>
                  <CardDescription className="text-xs text-muted-foreground font-light">Update status or copy snippets</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {selectedPost ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4 text-xs font-light">
                        <div>
                          <span className="text-muted-foreground uppercase tracking-wider text-[9px] block">Platform</span>
                          <span className="font-semibold text-foreground text-sm">{selectedPost.platform}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground uppercase tracking-wider text-[9px] block">Pillar Category</span>
                          <span className="font-semibold text-foreground text-sm">{selectedPost.pillar}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-1">Format Type</span>
                        <p className="text-sm font-semibold text-foreground leading-snug">{selectedPost.format}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground uppercase tracking-wider text-[9px]">Visual Preview</span>
                          <button
                            onClick={() => setPreviewItem({ type: 'post', id: selectedPost.id, template: selectedPost.template || 'feed-post', arm: selectedPost.arm || 'studio' })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-[4px] cursor-pointer transition-colors text-[10px] font-semibold uppercase tracking-wider"
                          >
                            <Maximize2 className="h-3 w-3" /> Preview &amp; Export
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={selectedPost.template || 'feed-post'}
                            onChange={(e) => updatePostTemplate(selectedPost.id, e.target.value as TemplateFormat, selectedPost.arm || 'studio')}
                            className="text-xs px-2 py-1.5 rounded-[4px] border border-border bg-muted/30 text-foreground cursor-pointer focus:outline-none"
                          >
                            {TEMPLATE_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                          <select
                            value={selectedPost.arm || 'studio'}
                            onChange={(e) => updatePostTemplate(selectedPost.id, selectedPost.template || 'feed-post', e.target.value as Arm)}
                            className="text-xs px-2 py-1.5 rounded-[4px] border border-border bg-muted/30 text-foreground cursor-pointer focus:outline-none"
                          >
                            {ARMS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                          </select>
                        </div>
                        {(() => {
                          const PREVIEW_WIDTH = 320
                          const SCALE = PREVIEW_WIDTH / 1080
                          const canvasHeight = selectedPost.template === 'story' ? 1920 : 1350
                          return (
                            <div
                              className="relative overflow-hidden rounded-[4px] border border-border cursor-pointer"
                              style={{ width: PREVIEW_WIDTH, height: canvasHeight * SCALE }}
                              onClick={() => setPreviewItem({ type: 'post', id: selectedPost.id, template: selectedPost.template || 'feed-post', arm: selectedPost.arm || 'studio' })}
                            >
                              <div style={{ width: 1080, height: canvasHeight, transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
                                <TemplateRenderer
                                  format={selectedPost.template || 'feed-post'}
                                  arm={selectedPost.arm || 'studio'}
                                  source={selectedPost}
                                  fileName={`dako-${selectedPost.id}`}
                                  showDownloadButton={false}
                                />
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {selectedPost.visual && (
                        <div className="bg-muted/40 p-3.5 rounded-[4px] border border-border">
                          <span className="text-muted-foreground uppercase tracking-wider text-[9px] block mb-1">Visual Asset Blueprint</span>
                          <p className="text-xs font-light text-foreground leading-relaxed">{selectedPost.visual}</p>
                        </div>
                      )}

                      {selectedPost.copy ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground uppercase tracking-wider text-[9px]">Script / Copy Draft</span>
                            <button
                              onClick={() => handleCopy(selectedPost.copy || '', `post_${selectedPost.id}`)}
                              className="p-1.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-[4px] cursor-pointer transition-colors border border-border"
                              title="Copy to clipboard"
                            >
                              {copiedId === `post_${selectedPost.id}` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <pre className="text-xs font-mono bg-muted/30 p-4 border border-border rounded-[4px] overflow-auto max-h-72 whitespace-pre-wrap text-foreground leading-relaxed">
                            {selectedPost.copy}
                          </pre>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/20 border border-dashed border-border rounded-[4px] text-center">
                          <p className="text-xs text-muted-foreground font-light">Copy template details are pending in Copy Bank.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 border border-dashed border-border rounded-[6px]">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-light">Select a scheduled post to load assets.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        )}

        {/* Tab content 3: Copy Bank Manager */}
        {activeTab === 'copybank' && (
          <div className="grid gap-8">
            {/* Month & Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/60 backdrop-blur-md p-5 border border-border rounded-[8px]">
              
              <div className="flex gap-2">
                {[1, 2, 3].map(m => (
                  <button
                    key={m}
                    onClick={() => setCopyMonth(m)}
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${copyMonth === m ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    Month {m}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 md:ml-auto">
                {copyCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCopyCategory(category)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                      selectedCopyCategory === category
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search copy templates..."
                  value={copySearch}
                  onChange={(e) => setCopySearch(e.target.value)}
                  className="pl-9 bg-background/50 border-border h-9 rounded-full focus-visible:ring-primary text-xs text-foreground placeholder-muted-foreground/60"
                />
              </div>
            </div>

            {/* Copy bank assets */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCopyBank.map((asset) => (
                <Card key={asset.id} className={`border border-border bg-card/60 backdrop-blur-md rounded-[8px] flex flex-col justify-between transition-all ${asset.status === 'done' ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-3 border-b border-border/15">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <Badge variant="outline" className="text-[9px] border-primary/20 text-primary font-bold uppercase">
                        {asset.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <select 
                          value={asset.status || 'todo'} 
                          onChange={(e) => updateCopyStatus(asset.id, e.target.value)}
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] border focus:outline-none cursor-pointer ${asset.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : asset.status === 'inprogress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-muted/30 text-muted-foreground border-border'}`}
                        >
                          <option value="todo">To Do</option>
                          <option value="inprogress">In Prog</option>
                          <option value="done">Done</option>
                        </select>
                        <button
                          onClick={() => handleCopy(`${asset.content}${asset.cta ? `\n\n${asset.cta}` : ''}`, `copy_${asset.id}`)}
                          className="p-1 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-[4px] cursor-pointer transition-colors border border-border"
                          title="Copy to clipboard"
                        >
                          {copiedId === `copy_${asset.id}` ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <CardTitle className="font-display text-sm font-bold text-foreground">{asset.topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex-grow flex flex-col justify-between gap-4">
                    <p className="text-xs font-light text-foreground leading-relaxed whitespace-pre-wrap">
                      {asset.content}
                    </p>
                    {asset.cta && (
                      <div className="border-t border-border pt-3 flex items-center justify-between text-[11px] font-medium text-primary bg-primary/5 px-2.5 py-1.5 rounded-[4px]">
                        <span>CTA: {asset.cta}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setPreviewItem({ type: 'copy', id: asset.id, template: asset.template || 'feed-post', arm: asset.arm || 'studio' })}
                      className="mt-auto inline-flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-[4px] cursor-pointer transition-colors text-[10px] font-semibold uppercase tracking-wider"
                    >
                      <Sparkles className="h-3 w-3" /> Preview Visual
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab content 4: CRM Lead Tracker */}
        {activeTab === 'crm' && (
          <div className="grid gap-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Total Leads', value: crmKpis.totalLeads.toLocaleString('en-US'), icon: Users },
                { label: 'Awaiting Approval', value: crmKpis.awaitingApproval.toLocaleString('en-US'), icon: Clock },
                { label: 'Closed Deals', value: crmKpis.closedDeals.toLocaleString('en-US'), icon: TrendingUp },
                { label: 'Revenue Collected', value: `$${crmKpis.revenueCollected.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: Wallet, accent: true },
                { label: 'Revenue Outstanding', value: `$${crmKpis.revenueOutstanding.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: DollarSign },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="flex flex-col gap-2 bg-card/60 backdrop-blur-md p-4 border border-border rounded-[8px]">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </span>
                  <span className={`text-xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Filter controls */}
            <div className="flex flex-col gap-4 bg-card/60 backdrop-blur-md p-5 border border-border rounded-[8px]">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Pipeline (kind) toggle */}
                <div className="flex gap-2">
                  {(['all', 'outreach', 'inbound'] as const).map(kind => (
                    <button
                      key={kind}
                      onClick={() => { setCrmKind(kind); setCrmFilter('All') }}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 capitalize ${
                        crmKind === kind
                          ? 'bg-foreground text-background'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {kind === 'all' ? 'All leads' : kind}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-light text-muted-foreground">
                  Displaying {filteredLeads.length} of {crmLeads.length} leads
                  {repliesToReview > 0 && (
                    <span className="ml-2 text-primary font-semibold">· {repliesToReview} to review</span>
                  )}
                </span>
              </div>

              {/* Status chips */}
              <div className="flex flex-wrap gap-2">
                {crmFilterChips.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCrmFilter(filter)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                      crmFilter === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px] overflow-hidden">
              <CardContent className="p-0 overflow-x-auto">
                {filteredLeads.length > 0 ? (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold bg-muted/40">
                        <th className="py-4 px-5">Date</th>
                        <th className="py-4 px-5">Prospect</th>
                        <th className="py-4 px-5">Segment</th>
                        <th className="py-4 px-5">Contact</th>
                        <th className="py-4 px-5">Pipeline Status</th>
                        <th className="py-4 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 font-light text-muted-foreground">
                      {filteredLeads.map((lead) => {
                        const isOutreach = lead.leadKind === 'outreach'
                        const displayName = lead.company || lead.name || '—'
                        const displaySub = isOutreach ? (lead.description || lead.industry || '') : (lead.message || '')
                        const contact = lead.email || lead.contactInfo || ''
                        const statusOptions = isOutreach ? OUTREACH_STATUSES : INBOUND_STATUSES
                        const mailto = contact.includes('@')
                          ? `mailto:${contact}?subject=${encodeURIComponent('A quick video idea for ' + (lead.company || 'your brand'))}`
                          : `https://wa.me/${contact.replace(/[+\s]/g, '')}`
                        return (
                        <React.Fragment key={lead.id}>
                        <tr className="hover:bg-muted/5 transition-colors align-top">
                          <td className="py-4 px-5 whitespace-nowrap text-xs text-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                              {new Date(lead.timestamp).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                            {lead.sentAt && (
                              <span className="block mt-1 text-[10px] text-muted-foreground/70">
                                sent {new Date(lead.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            <button
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="flex items-center gap-2.5 text-left cursor-pointer group"
                            >
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarFallback
                                  className="text-[10px] font-bold text-white"
                                  style={{ backgroundColor: armAvatarColor(lead.arm) }}
                                >
                                  {displayName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{displayName}</p>
                                {displaySub && (
                                  <p className="text-xs text-muted-foreground mt-1 max-w-sm line-clamp-2 leading-relaxed" title={displaySub}>
                                    {isOutreach ? displaySub : `"${displaySub}"`}
                                  </p>
                                )}
                              </span>
                            </button>
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase w-fit">
                                  {isOutreach ? (lead.industry || 'Outreach') : (lead.service || 'Inbound')}
                                </Badge>
                                {isOutreach && lead.arm && (
                                  <Badge variant="outline" className={`text-[9px] font-bold uppercase w-fit ${
                                    lead.arm === 'Motion' ? 'border-violet-400/30 text-violet-400' : 'border-sky-400/30 text-sky-400'
                                  }`}>
                                    {lead.arm}
                                  </Badge>
                                )}
                                {isOutreach && lead.qualificationStatus && (
                                  <Badge variant="outline" className={`text-[9px] font-bold uppercase w-fit ${
                                    lead.qualificationStatus === 'Qualified'
                                      ? 'text-emerald-400 border-emerald-400/30'
                                      : lead.qualificationStatus === 'Low priority'
                                      ? 'text-amber-400 border-amber-400/30'
                                      : 'text-destructive-foreground border-destructive/30'
                                  }`}>
                                    {lead.qualificationStatus}
                                  </Badge>
                                )}
                              </div>
                              {isOutreach && lead.template && (
                                <span className="text-[10px] text-muted-foreground">Template {lead.template}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap text-xs font-mono text-foreground">
                            {contact}
                            {!lead.email && (lead.phone || lead.contactName) && (
                              <span className="block mt-1 text-[10px] font-sans font-semibold text-amber-400">
                                no email — {lead.phone || lead.contactName}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            {/* Pipeline status changer */}
                            <select
                              value={lead.status}
                              disabled={savingLeadId === lead.id}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors disabled:opacity-50 ${
                                lead.status === 'Closed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : lead.status === 'Lost' || lead.status === 'Breakup sent'
                                  ? 'bg-destructive/10 text-destructive-foreground border-destructive/20'
                                  : lead.status === 'Proposal Sent'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : lead.status === 'Replied'
                                  ? 'bg-primary/15 text-primary border-primary/30'
                                  : lead.status === 'Contacted' || lead.status === 'Sent' || lead.status === 'Bumped'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              {statusOptions.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            {/* Direct channel triggers */}
                            <div className="flex justify-end gap-1.5">
                              {(lead.customizedEmailBody || lead.qualificationReason || lead.suggestedReply) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 border border-primary/30 text-primary hover:bg-primary/10 cursor-pointer rounded-[4px]"
                                  onClick={() => setSelectedLeadId(lead.id)}
                                  title="View details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px]"
                                onClick={() => handleCopy(displaySub || displayName, `msg_${lead.id}`)}
                                title="Copy details"
                              >
                                {copiedId === `msg_${lead.id}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px]"
                                asChild
                                title="Reply via Email / WhatsApp"
                              >
                                <a href={mailto} target="_blank" rel="noopener noreferrer">
                                  <Send className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                        </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground font-light text-base">No leads found in this pipeline state.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoices — generated when a lead is marked Closed */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Invoices
                </h3>
                <span className="text-xs font-light text-muted-foreground">{invoices.length} total</span>
              </div>
              <Card className="border border-border bg-card/60 backdrop-blur-md rounded-[8px] overflow-hidden">
                <CardContent className="p-0 overflow-x-auto">
                  {invoices.length > 0 ? (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold bg-muted/40">
                          <th className="py-4 px-5">Invoice</th>
                          <th className="py-4 px-5">Client</th>
                          <th className="py-4 px-5">Total</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10 font-light text-muted-foreground">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-muted/5 transition-colors">
                            <td className="py-4 px-5 whitespace-nowrap text-xs font-mono text-foreground">
                              <button
                                onClick={() => setSelectedInvoiceId(inv.id)}
                                className="cursor-pointer hover:text-primary transition-colors text-left"
                              >
                                {inv.invoiceNumber}
                              </button>
                              {!inv.pdfPath && (
                                <span className="block mt-1 text-[10px] font-sans text-amber-400">PDF not stored</span>
                              )}
                            </td>
                            <td className="py-4 px-5">
                              <button onClick={() => setSelectedInvoiceId(inv.id)} className="cursor-pointer text-left">
                                <p className="font-semibold text-foreground text-sm hover:text-primary transition-colors">{inv.clientName || '—'}</p>
                                {inv.clientEmail && (
                                  <p className="text-xs text-muted-foreground mt-1">{inv.clientEmail}</p>
                                )}
                              </button>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap text-xs font-mono text-foreground">
                              ${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <Badge variant="outline" className={`text-[10px] font-bold uppercase ${
                                inv.status === 'Paid'
                                  ? 'border-emerald-500/20 text-emerald-400'
                                  : inv.status === 'Sent'
                                  ? 'border-blue-500/20 text-blue-400'
                                  : inv.status === 'Void'
                                  ? 'border-destructive/20 text-destructive-foreground'
                                  : 'border-muted-foreground/20 text-muted-foreground'
                              }`}>
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-5 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-1.5">
                                {inv.status === 'Draft' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={invoiceActionId === inv.id}
                                    className="h-8 px-3 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px] disabled:opacity-50"
                                    onClick={() => handleSendInvoice(inv.id)}
                                  >
                                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send
                                  </Button>
                                )}
                                {inv.status === 'Sent' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={invoiceActionId === inv.id}
                                    className="h-8 px-3 text-xs border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-[4px] disabled:opacity-50"
                                    onClick={() => handleMarkInvoicePaid(inv.id)}
                                  >
                                    <DollarSign className="h-3.5 w-3.5 mr-1.5" /> Mark Paid
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground font-light text-sm">
                        No invoices yet — mark a lead Closed to create one.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>

      {/* Create Invoice modal — opened when a lead is marked Closed */}
      <Dialog open={Boolean(invoiceModalLead)} onOpenChange={(open) => { if (!open) setInvoiceModalLead(null) }}>
        <DialogContent className="sm:max-w-xl rounded-[8px]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Client name</label>
                <Input
                  value={invoiceClientName}
                  onChange={(e) => setInvoiceClientName(e.target.value)}
                  placeholder="Client or company name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Client email</label>
                <Input
                  value={invoiceClientEmail}
                  onChange={(e) => setInvoiceClientEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Line items</label>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px]"
                  onClick={addInvoiceItem}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add item
                </Button>
              </div>
              {invoiceItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={item.description}
                    onChange={(e) => updateInvoiceItem(idx, { description: e.target.value })}
                    placeholder="Description"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) => updateInvoiceItem(idx, { quantity: Number(e.target.value) || 0 })}
                    placeholder="Qty"
                    className="w-16"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => updateInvoiceItem(idx, { unitPrice: Number(e.target.value) || 0 })}
                    placeholder="Unit price"
                    className="w-28"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive-foreground cursor-pointer rounded-[4px]"
                    onClick={() => removeInvoiceItem(idx)}
                    disabled={invoiceItems.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-right">
                Subtotal: ${invoiceItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes (optional)</label>
              <Textarea
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                rows={3}
                placeholder="Payment terms, project reference, etc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setInvoiceModalLead(null)}
              disabled={invoiceSaving}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleCreateInvoice}
              disabled={invoiceSaving || invoiceItems.every(i => !i.description.trim())}
            >
              {invoiceSaving ? 'Creating…' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visual Preview & Export — shared by Content Calendar + Copy Bank, renders the matching social template at full export resolution */}
      <Dialog open={Boolean(previewItem)} onOpenChange={(open) => { if (!open) setPreviewItem(null) }}>
        <DialogContent className="sm:max-w-2xl rounded-[8px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Preview &amp; Export</DialogTitle>
          </DialogHeader>
          {previewItem && (() => {
            const source = previewItem.type === 'post'
              ? livePosts.find(p => p.id === previewItem.id)
              : liveCopy.find(c => c.id === previewItem.id)
            if (!source) return null
            const PREVIEW_WIDTH = 360
            const SCALE = PREVIEW_WIDTH / 1080
            const canvasHeight = previewItem.template === 'story' ? 1920 : 1350
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={previewItem.template}
                    onChange={(e) => {
                      const template = e.target.value as TemplateFormat
                      setPreviewItem({ ...previewItem, template })
                      previewItem.type === 'post' ? updatePostTemplate(previewItem.id, template, previewItem.arm) : updateCopyTemplate(previewItem.id, template, previewItem.arm)
                    }}
                    className="text-xs px-2 py-1.5 rounded-[4px] border border-border bg-muted/30 text-foreground cursor-pointer focus:outline-none"
                  >
                    {TEMPLATE_FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <select
                    value={previewItem.arm}
                    onChange={(e) => {
                      const arm = e.target.value as Arm
                      setPreviewItem({ ...previewItem, arm })
                      previewItem.type === 'post' ? updatePostTemplate(previewItem.id, previewItem.template, arm) : updateCopyTemplate(previewItem.id, previewItem.template, arm)
                    }}
                    className="text-xs px-2 py-1.5 rounded-[4px] border border-border bg-muted/30 text-foreground cursor-pointer focus:outline-none"
                  >
                    {ARMS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-center">
                  <div style={{ width: PREVIEW_WIDTH, height: canvasHeight * SCALE }} className="overflow-hidden rounded-[4px] border border-border">
                    <div style={{ width: 1080, height: canvasHeight, transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
                      <TemplateRenderer
                        format={previewItem.template}
                        arm={previewItem.arm}
                        source={source}
                        fileName={`dako-${previewItem.type}-${previewItem.id}`}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground font-light">Use the Download PNG button on the artwork above to export at full resolution (4x pixel density).</p>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Lead Detail panel — qualification, suggested reply, drafted-email review/approve, per-lead invoices */}
      <Sheet open={Boolean(selectedLead)} onOpenChange={(open) => { if (!open) setSelectedLeadId(null) }}>
        <SheetContent className="sm:max-w-lg w-full overflow-y-auto">
          {selectedLead && (() => {
            const lead = selectedLead
            const isOutreach = lead.leadKind === 'outreach'
            const displayName = lead.company || lead.name || '—'
            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="text-sm font-bold text-white" style={{ backgroundColor: armAvatarColor(lead.arm) }}>
                        {displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <SheetTitle>{displayName}</SheetTitle>
                      <SheetDescription>{lead.email || lead.contactInfo || 'No contact on file'}</SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase w-fit">
                      {isOutreach ? (lead.industry || 'Outreach') : (lead.service || 'Inbound')}
                    </Badge>
                    {lead.arm && (
                      <Badge variant="outline" className="text-[9px] font-bold uppercase w-fit" style={{ borderColor: `${armAvatarColor(lead.arm)}4D`, color: armAvatarColor(lead.arm) }}>
                        {lead.arm}
                      </Badge>
                    )}
                    {lead.qualificationStatus && (
                      <Badge variant="outline" className={`text-[9px] uppercase font-bold ${
                        lead.qualificationStatus === 'Qualified'
                          ? 'text-emerald-400 border-emerald-400/30'
                          : lead.qualificationStatus === 'Low priority'
                          ? 'text-amber-400 border-amber-400/30'
                          : 'text-destructive-foreground border-destructive/30'
                      }`}>
                        {lead.qualificationStatus}
                      </Badge>
                    )}
                  </div>
                </SheetHeader>

                <div className="flex flex-col gap-4 px-4 pb-4">
                  {lead.painPoint && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Pain point:</span> {lead.painPoint}
                    </p>
                  )}

                  {lead.suggestedReply && (
                    <div className="border border-primary/20 rounded-[6px] p-4 bg-background/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Suggested reply — review before sending</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px]"
                          onClick={() => handleCopy(lead.suggestedReply || '', `reply_${lead.id}`)}
                        >
                          {copiedId === `reply_${lead.id}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="ml-1.5">Copy</span>
                        </Button>
                      </div>
                      <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{lead.suggestedReply}</p>
                      {lead.suggestedReasoning && (
                        <p className="mt-2 text-[11px] text-muted-foreground italic">Why: {lead.suggestedReasoning}</p>
                      )}
                    </div>
                  )}

                  {(lead.customizedEmailBody || lead.qualificationReason) && (
                    <div className="border border-primary/20 rounded-[6px] p-4 bg-background/60">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {lead.customizedEmailBody ? 'Drafted outreach email — review before sending' : 'Qualification notes'}
                        </span>
                        {lead.customizedEmailBody && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px]"
                              onClick={() => handleCopy(
                                `${emailDrafts[lead.id]?.subject ?? lead.customizedEmailSubject ?? ''}\n\n${emailDrafts[lead.id]?.body ?? lead.customizedEmailBody ?? ''}`,
                                `draft_${lead.id}`
                              )}
                            >
                              {copiedId === `draft_${lead.id}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                              <span className="ml-1.5">Copy</span>
                            </Button>
                            <Button
                              size="sm"
                              disabled={savingLeadId === lead.id}
                              className={`h-7 px-2 text-xs cursor-pointer rounded-[4px] disabled:opacity-50 ${
                                lead.emailApproved
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                              }`}
                              onClick={() => handleApproveEmail(lead.id)}
                            >
                              {lead.emailApproved ? <Check className="h-3.5 w-3.5 mr-1.5" /> : null}
                              {lead.emailApproved ? 'Approved' : 'Approve'}
                            </Button>
                          </div>
                        )}
                      </div>

                      {lead.customizedEmailBody && (
                        <>
                          <input
                            type="text"
                            value={emailDrafts[lead.id]?.subject ?? lead.customizedEmailSubject ?? ''}
                            onChange={(e) => setEmailDrafts(prev => ({
                              ...prev,
                              [lead.id]: { subject: e.target.value, body: prev[lead.id]?.body ?? lead.customizedEmailBody ?? '' }
                            }))}
                            className="w-full mb-2 text-xs font-semibold text-foreground bg-muted/30 border border-border rounded-[4px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Email subject"
                          />
                          <textarea
                            value={emailDrafts[lead.id]?.body ?? lead.customizedEmailBody ?? ''}
                            onChange={(e) => setEmailDrafts(prev => ({
                              ...prev,
                              [lead.id]: { subject: prev[lead.id]?.subject ?? lead.customizedEmailSubject ?? '', body: e.target.value }
                            }))}
                            rows={6}
                            className="w-full text-xs text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 border border-border rounded-[4px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                          />
                        </>
                      )}

                      {lead.qualificationReason && (
                        <p className="mt-2 text-[11px] text-muted-foreground italic">Why: {lead.qualificationReason}</p>
                      )}
                    </div>
                  )}

                  {lead.notes && (
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Notes</span>
                      <p className="text-xs text-foreground mt-1 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Invoices</span>
                    {selectedLeadInvoices.length > 0 ? (
                      <div className="flex flex-col gap-2 mt-2">
                        {selectedLeadInvoices.map(inv => (
                          <button
                            key={inv.id}
                            onClick={() => { setSelectedInvoiceId(inv.id); setSelectedLeadId(null) }}
                            className="flex items-center justify-between border border-border rounded-[6px] px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer text-left"
                          >
                            <span className="text-xs font-mono text-foreground">{inv.invoiceNumber}</span>
                            <span className="text-xs text-muted-foreground">${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} · {inv.status}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">No invoices for this lead yet.</p>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>

      {/* Invoice Detail panel — line items, notes, timeline, PDF preview */}
      <Sheet open={Boolean(selectedInvoice)} onOpenChange={(open) => { if (!open) setSelectedInvoiceId(null) }}>
        <SheetContent className="sm:max-w-lg w-full overflow-y-auto">
          {selectedInvoice && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between gap-2">
                  <SheetTitle className="font-mono">{selectedInvoice.invoiceNumber}</SheetTitle>
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase ${
                    selectedInvoice.status === 'Paid'
                      ? 'border-emerald-500/20 text-emerald-400'
                      : selectedInvoice.status === 'Sent'
                      ? 'border-blue-500/20 text-blue-400'
                      : selectedInvoice.status === 'Void'
                      ? 'border-destructive/20 text-destructive-foreground'
                      : 'border-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {selectedInvoice.status}
                  </Badge>
                </div>
                <SheetDescription>
                  {selectedInvoice.clientName || '—'}{selectedInvoice.clientEmail ? ` · ${selectedInvoice.clientEmail}` : ''}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="border border-border rounded-[6px] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-semibold bg-muted/40">
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3 text-right">Qty</th>
                        <th className="py-2 px-3 text-right">Unit</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {selectedInvoice.items.map(item => (
                        <tr key={item.id}>
                          <td className="py-2 px-3 text-foreground">{item.description}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">{item.quantity}</td>
                          <td className="py-2 px-3 text-right text-muted-foreground">${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="py-2 px-3 text-right text-foreground font-mono">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-t border-border p-3 flex flex-col gap-1 items-end bg-muted/20">
                    <span className="text-xs text-muted-foreground">Subtotal: ${selectedInvoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    {selectedInvoice.tax > 0 && (
                      <span className="text-xs text-muted-foreground">Tax: ${selectedInvoice.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    )}
                    <span className="text-sm font-bold text-foreground">Total: ${selectedInvoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Notes</span>
                    <p className="text-xs text-foreground mt-1 whitespace-pre-wrap leading-relaxed">{selectedInvoice.notes}</p>
                  </div>
                )}

                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span>Created {new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  {selectedInvoice.sentAt && (
                    <span>Sent {new Date(selectedInvoice.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  )}
                  {selectedInvoice.paidAt && (
                    <span>Paid {new Date(selectedInvoice.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px] disabled:opacity-50"
                    disabled={!selectedInvoice.pdfPath || pdfLoadingId === selectedInvoice.id}
                    onClick={() => handleViewPdf(selectedInvoice.id)}
                    title={selectedInvoice.pdfPath ? 'Open PDF' : 'PDF not stored — see CRM_LAUNCH_CHECKLIST.md'}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> {pdfLoadingId === selectedInvoice.id ? 'Loading…' : 'View PDF'}
                  </Button>
                  {selectedInvoice.status === 'Draft' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={invoiceActionId === selectedInvoice.id}
                      className="h-8 px-3 text-xs border border-border hover:bg-primary/10 hover:text-primary cursor-pointer rounded-[4px] disabled:opacity-50"
                      onClick={() => handleSendInvoice(selectedInvoice.id)}
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" /> Send
                    </Button>
                  )}
                  {selectedInvoice.status === 'Sent' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={invoiceActionId === selectedInvoice.id}
                      className="h-8 px-3 text-xs border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-[4px] disabled:opacity-50"
                      onClick={() => handleMarkInvoicePaid(selectedInvoice.id)}
                    >
                      <DollarSign className="h-3.5 w-3.5 mr-1.5" /> Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
