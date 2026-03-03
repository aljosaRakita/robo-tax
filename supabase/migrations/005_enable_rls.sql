-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.power_ups enable row level security;
alter table public.user_connections enable row level security;

-- Profiles: users can read and update their own row
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Categories: public read
create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

-- Power-ups: public read (only enabled ones)
create policy "Enabled power-ups are publicly readable"
  on public.power_ups for select
  using (enabled = true);

-- User connections: users CRUD their own rows
create policy "Users can read own connections"
  on public.user_connections for select
  using (auth.uid() = user_id);

create policy "Users can insert own connections"
  on public.user_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own connections"
  on public.user_connections for delete
  using (auth.uid() = user_id);
