import React from 'react'
import { cookies } from 'next/headers'
import { LoginScreen } from './login-screen'
import { DashboardClient } from './dashboard-client'
import { getStrategyData, getCalendarData, getCopyBankData, getLeads } from '@/utils/marketing-data'
import { verifyToken } from '@/lib/session'

export const metadata = {
  title: 'Marketing Dashboard & CRM | Dako Studios',
  description: 'Internal strategy, calendar, copy assets, and inbound briefs tracking portal.',
}

export default async function MarketingDashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('dako_marketing_token')

  let isAuthenticated = false
  if (token?.value) {
    const payload = await verifyToken(token.value)
    isAuthenticated = !!payload?.admin
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  // Load strategy, calendar, copy bank, and local leads
  const strategy = getStrategyData()
  const calendar = getCalendarData()
  const copyBank = getCopyBankData()
  const leads = await getLeads()

  return (
    <DashboardClient
      strategy={strategy}
      calendar={calendar}
      copyBank={copyBank}
      leads={leads}
    />
  )
}
