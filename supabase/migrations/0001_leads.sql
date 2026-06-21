-- Dako Studios — Outreach CRM leads table
-- Run this in the Supabase SQL editor (or via the Supabase MCP / CLI) once a project is provisioned.
-- Holds BOTH cold-outreach prospects (lead_kind = 'outreach') and inbound contact-form
-- submissions (lead_kind = 'inbound') in one table so the dashboard CRM is a single view.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  lead_kind           text not null default 'outreach'
                        check (lead_kind in ('outreach','inbound')),

  -- Outreach prospect fields (from outreach_tracker.csv)
  company             text,
  industry            text,
  description         text,
  email               text,
  source              text,
  address             text,
  template            text check (template in ('A','B','C')),
  email_type          text,

  -- Inbound contact-form fields (from /api/contact)
  name                text,
  contact_info        text,
  service             text,
  message             text,

  -- Pipeline state (superset of both flows)
  status              text not null default 'Not sent'
                        check (status in (
                          'Not sent','Sent','Bumped','Replied',
                          'Identified','Contacted','Proposal Sent',
                          'Closed','Lost','Breakup sent'
                        )),

  -- Outreach automation bookkeeping
  sent_at             timestamptz,
  last_contact_at     timestamptz,
  thread_id           text,            -- unused since send moved to Resend; kept for back-compat
  message_id          text,            -- our RFC Message-ID of the opener (for In-Reply-To threading)
  suggested_reply     text,            -- AI-drafted reply, awaiting human review (never auto-sent)
  suggested_reasoning text,            -- one-line rationale from the triage step

  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- A cold prospect appears once per email; keep outreach emails unique but allow
-- inbound rows (which may reuse an address) to coexist.
create unique index if not exists leads_outreach_email_unique
  on public.leads (email)
  where lead_kind = 'outreach' and email is not null;

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_kind_idx   on public.leads (lead_kind);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();
