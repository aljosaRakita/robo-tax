create table public.tax_strategies (
  id       text primary key,
  title    text not null,
  workflow text not null,
  priority integer not null check (priority between 1 and 5)
);

alter table public.tax_strategies enable row level security;

create policy "Tax strategies are publicly readable"
  on public.tax_strategies for select
  using (true);
