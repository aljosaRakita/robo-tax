-- ============================================================
-- Migration 010: user_strategy_matches
-- Per-user strategy evaluations produced by the strategy engine.
-- ============================================================

create table public.user_strategy_matches (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  strategy_id     text not null references public.tax_strategies(id) on delete cascade,
  trigger_id      uuid not null references public.strategy_triggers(id) on delete cascade,
  estimated_low   numeric not null default 0,
  estimated_base  numeric not null default 0,
  estimated_high  numeric not null default 0,
  confidence      integer not null default 0 check (confidence between 0 and 100),
  evidence        jsonb not null default '{}',
  reasoning       text,
  status          text not null default 'identified'
                    check (status in ('identified', 'verified', 'claimed', 'dismissed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (user_id, strategy_id)
);

-- RLS — users read own; writes via admin client
alter table public.user_strategy_matches enable row level security;

create policy "Users can read own strategy matches"
  on public.user_strategy_matches for select
  using (auth.uid() = user_id);

-- Auto-update updated_at
create trigger user_strategy_matches_updated_at
  before update on public.user_strategy_matches
  for each row execute function public.set_updated_at();
