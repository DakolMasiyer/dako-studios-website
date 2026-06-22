-- Qualification engine: arm-aware gap detection + AI-drafted, human-approved outreach.
-- Additive only — all columns nullable/defaulted, existing 87 rows unaffected.

alter table public.leads
  add column if not exists arm                     text check (arm in ('Motion','Labs')),
  add column if not exists qualification_status     text check (qualification_status in ('Qualified','Low priority','Disqualified')),
  add column if not exists qualification_reason     text,
  add column if not exists pain_point               text,
  add column if not exists customized_email_subject text,
  add column if not exists customized_email_body    text,
  add column if not exists email_approved           boolean not null default false,
  add column if not exists phone                    text,
  add column if not exists contact_name             text,
  add column if not exists priority                 text check (priority in ('HIGH','MEDIUM','LOW')),
  add column if not exists batch_run                text;

-- Backfill: the existing 86 outreach leads were all sourced for the Motion arm.
update public.leads
  set arm = 'Motion'
  where lead_kind = 'outreach' and arm is null;

create index if not exists leads_arm_idx on public.leads (arm);
create index if not exists leads_qualification_status_idx on public.leads (qualification_status);
