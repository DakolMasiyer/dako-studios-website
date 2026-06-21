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
  TextAlignJustify
} from 'lucide-react'
import { StrategyData, CalendarPost, CopyAsset, Lead } from '@/utils/marketing-data'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  
  // Copy Bank State
  const [copySearch, setCopySearch] = useState('')
  const [selectedCopyCategory, setSelectedCopyCategory] = useState('All')

  // CRM State
  const [crmLeads, setCrmLeads] = useState<Lead[]>(leads)
  const [crmFilter, setCrmFilter] = useState<string>('All')
  const [crmKind, setCrmKind] = useState<'all' | 'outreach' | 'inbound'>('all')
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null)

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
      const matchStatus = crmFilter === 'All' || l.status === crmFilter
      return matchKind && matchStatus
    })
  }, [crmLeads, crmFilter, crmKind])

  // Status chips shown depend on which pipeline (kind) is active
  const OUTREACH_STATUSES = ['Not sent', 'Sent', 'Bumped', 'Replied', 'Proposal Sent', 'Closed', 'Lost', 'Breakup sent']
  const INBOUND_STATUSES = ['Identified', 'Contacted', 'Proposal Sent', 'Closed', 'Lost']
  const crmFilterChips = ['All', ...(crmKind === 'inbound' ? INBOUND_STATUSES : OUTREACH_STATUSES)]

  // Replies awaiting human review are the actionable signal for the badge
  const repliesToReview = crmLeads.filter(l => l.status === 'Replied').length

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
                      <div className="mt-auto border-t border-border pt-3 flex items-center justify-between text-[11px] font-medium text-primary bg-primary/5 px-2.5 py-1.5 rounded-[4px]">
                        <span>CTA: {asset.cta}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab content 4: CRM Lead Tracker */}
        {activeTab === 'crm' && (
          <div className="grid gap-8">
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
                            <p className="font-semibold text-foreground text-sm">{displayName}</p>
                            {displaySub && (
                              <p className="text-xs text-muted-foreground mt-1 max-w-sm line-clamp-2 leading-relaxed" title={displaySub}>
                                {isOutreach ? displaySub : `"${displaySub}"`}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase w-fit">
                                {isOutreach ? (lead.industry || 'Outreach') : (lead.service || 'Inbound')}
                              </Badge>
                              {isOutreach && lead.template && (
                                <span className="text-[10px] text-muted-foreground">Template {lead.template}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-5 whitespace-nowrap text-xs font-mono text-foreground">
                            {contact}
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
                        {/* AI-suggested reply awaiting human review (never auto-sent) */}
                        {lead.suggestedReply && (
                          <tr className="bg-primary/5">
                            <td colSpan={6} className="px-5 py-4">
                              <div className="border border-primary/20 rounded-[6px] p-4 bg-background/60">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                    Suggested reply — review before sending
                                  </span>
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
                            </td>
                          </tr>
                        )}
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
          </div>
        )}

      </div>
    </div>
  )
}
