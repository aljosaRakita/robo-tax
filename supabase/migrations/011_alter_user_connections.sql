-- ============================================================
-- Migration 011: extend user_connections
-- Add integration tracking columns to the existing table.
-- ============================================================

alter table public.user_connections
  add column provider             text,
  add column integration_status   text not null default 'pending'
                                    check (integration_status in ('pending', 'connected', 'syncing', 'synced', 'error')),
  add column last_synced_at       timestamptz,
  add column metadata             jsonb not null default '{}';
