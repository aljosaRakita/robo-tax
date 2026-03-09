-- Waitlist signups
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null unique,
  phone      text        not null,
  reason     text,
  email_confirmed  boolean not null default false,
  confirmation_code text,
  code_expires_at  timestamptz,
  created_at       timestamptz not null default now()
);

-- Allow inserts/updates from the API (service-role key) without RLS for admin,
-- but enable RLS so anon/authenticated can't read the table directly.
alter table public.waitlist enable row level security;
