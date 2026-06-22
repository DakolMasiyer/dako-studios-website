-- Loop C (requalification) + 5-arm expansion. Additive only.

alter table public.leads add column if not exists requalified_at timestamptz;

-- Existing CHECK only allows ('Motion','Labs'); must be dropped and redefined to add the 3 new arms.
alter table public.leads drop constraint if exists leads_arm_check;
alter table public.leads add constraint leads_arm_check check (arm in ('Motion','Labs','Brand','Film','Academy'));
