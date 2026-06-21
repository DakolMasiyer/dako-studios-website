import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase admin client (service-role key).
 *
 * NEVER import this into a client component — the service-role key bypasses RLS.
 * The dashboard is password + signed-session gated, and the only write path is the
 * /api/marketing/leads route, so we use the service role for simplicity here.
 *
 * If the env vars are not set the app gracefully falls back to the legacy
 * content/leads.json store (see marketing-data.ts), so the dashboard keeps working
 * until a Supabase project is provisioned.
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
}

let cached: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }
  if (!cached) {
    cached = createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return cached
}
