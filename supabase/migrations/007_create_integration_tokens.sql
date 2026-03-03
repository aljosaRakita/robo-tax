-- ============================================================
-- Migration 007: integration_tokens
-- Stores encrypted OAuth / Plaid tokens per user + provider
-- ============================================================

create table public.integration_tokens (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  provider              text not null,
  access_token_enc      text,
  refresh_token_enc     text,
  token_expires_at      timestamptz,
  plaid_item_id         text,
  plaid_access_token_enc text,
  provider_user_id      text,
  scopes                text[] not null default '{}',
  status                text not null default 'active'
                          check (status in ('active', 'expired', 'revoked', 'error')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  unique (user_id, provider)
);

-- RLS — users can read own; writes go through admin (service_role) client
alter table public.integration_tokens enable row level security;

create policy "Users can read own integration tokens"
  on public.integration_tokens for select
  using (auth.uid() = user_id);

-- Auto-update updated_at
create trigger integration_tokens_updated_at
  before update on public.integration_tokens
  for each row execute function public.set_updated_at();
