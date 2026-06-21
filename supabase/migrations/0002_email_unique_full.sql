-- Replace the PARTIAL unique index on email with a FULL one.
-- PostgREST/supabase-js `upsert(..., { onConflict: 'email' })` cannot target a partial
-- index (it errors 42P10). A plain unique index on (email) works as the conflict target,
-- and since Postgres treats NULLs as distinct, inbound leads (email IS NULL) can still
-- coexist freely while outreach emails remain unique.

drop index if exists public.leads_outreach_email_unique;

create unique index if not exists leads_email_unique
  on public.leads (email);
