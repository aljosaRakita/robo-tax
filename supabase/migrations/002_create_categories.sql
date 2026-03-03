create table public.categories (
  id          text primary key,
  label       text not null,
  icon        text not null,
  description text not null,
  sort_order  integer not null default 0
);
