create table public.power_ups (
  id              text primary key,
  name            text not null,
  description     text not null,
  category_id     text not null references public.categories(id) on delete cascade,
  logo_url        text not null default '',
  savings_weight  integer not null default 1 check (savings_weight between 1 and 5),
  is_native       boolean not null default false,
  enabled         boolean not null default true
);
