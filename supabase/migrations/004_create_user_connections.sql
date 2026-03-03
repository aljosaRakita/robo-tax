create table public.user_connections (
  user_id     uuid not null references auth.users(id) on delete cascade,
  power_up_id text not null references public.power_ups(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, power_up_id)
);
