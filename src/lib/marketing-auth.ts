import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/session'

/**
 * Shared admin gate for marketing dashboard API routes. Mirrors the check used in
 * /api/marketing/status: a valid signed `dako_marketing_token` cookie with admin=true.
 */
export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('dako_marketing_token')
  if (!token?.value) return false
  const payload = await verifyToken(token.value)
  return Boolean(payload?.admin)
}
