-- ============================================================
-- Migration 008: integration_data
-- Cached financial data fetched from providers (accounts,
-- transactions, holdings, P&L, etc.)
-- ============================================================

create table public.integration_data (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  provider    text not null,
  data_type   text not null,            -- e.g. 'accounts', 'transactions', 'holdings', 'pnl'
  data        jsonb not null default '{}',
  fetched_at  timestamptz not null default now(),
  sync_cursor text,                     -- opaque cursor for incremental sync (e.g. Plaid cursor)
  is_stale    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_integration_data_lookup
  on public.integration_data (user_id, provider, data_type);

-- Unique constraint for upsert operations (one row per user+provider+data_type)
alter table public.integration_data
  add constraint integration_data_user_provider_type_key
  unique (user_id, provider, data_type);

-- RLS — users can read own; writes go through admin client
alter table public.integration_data enable row level security;

create policy "Users can read own integration data"
  on public.integration_data for select
  using (auth.uid() = user_id);

-- Auto-update updated_at
create trigger integration_data_updated_at
  before update on public.integration_data
  for each row execute function public.set_updated_at();
