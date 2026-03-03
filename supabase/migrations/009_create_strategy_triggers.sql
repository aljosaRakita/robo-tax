-- ============================================================
-- Migration 009: strategy_triggers
-- Rules that map (provider, data_type) → tax strategy matches
-- with conditions and savings formulas.
-- ============================================================

create table public.strategy_triggers (
  id              uuid primary key default gen_random_uuid(),
  strategy_id     text not null references public.tax_strategies(id) on delete cascade,
  provider        text not null,
  data_type       text not null,
  condition       jsonb not null default '{}',   -- {"field","op","value"} | {"and":[...]} | {"or":[...]}
  savings_formula text not null,                 -- "fixed:1500" or "net_income * 0.20"
  savings_floor   numeric,
  savings_ceiling numeric,
  requires_all    text[] not null default '{}',  -- other data_types that must also exist
  description     text,
  enabled         boolean not null default true,
  created_at      timestamptz not null default now()
);

-- RLS — public read (rules are not sensitive)
alter table public.strategy_triggers enable row level security;

create policy "Strategy triggers are publicly readable"
  on public.strategy_triggers for select
  using (true);
