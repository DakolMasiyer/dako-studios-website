-- Automated invoicing: triggered manually from the dashboard when a lead is marked
-- 'Closed'. Additive only — new tables, no changes to existing leads schema.

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id),
  invoice_number text not null unique,
  status text not null default 'Draft' check (status in ('Draft','Sent','Paid','Void')),
  client_name text,
  client_email text,
  subtotal numeric not null default 0,
  tax numeric not null default 0,
  total numeric not null default 0,
  notes text,
  pdf_path text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  paid_at timestamptz
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric not null default 1,
  unit_price numeric not null default 0,
  amount numeric not null default 0,
  sort_order int not null default 0
);

create index if not exists invoices_lead_id_idx on public.invoices (lead_id);
create index if not exists invoices_status_idx on public.invoices (status);
