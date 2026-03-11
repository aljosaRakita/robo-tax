-- Migration 013: Extend tax_strategies with production data model columns
-- Adds ~20 columns for sieve logic, detection tiers, savings formulas,
-- compliance requirements, and multi-audience views.
-- Existing columns (id, title, workflow, priority) are preserved for backward compatibility.

ALTER TABLE public.tax_strategies
  ADD COLUMN code                    text UNIQUE,
  ADD COLUMN irc_section             text,
  ADD COLUMN strategy_category       text,
  ADD COLUMN sieve                   jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN finder                  jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN iron_dome               jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN savings_formula         jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN auto_detection          jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN substantiation          jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN temporal_class          text,
  ADD COLUMN status                  text NOT NULL DEFAULT 'available',
  ADD COLUMN missing_data_behavior   text NOT NULL DEFAULT 'show_pending',
  ADD COLUMN prerequisite_strategies text[] NOT NULL DEFAULT '{}',
  ADD COLUMN unlocks_strategies      text[] NOT NULL DEFAULT '{}',
  ADD COLUMN collision_rules         jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN cpa_view                jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN client_view             jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN llm_evaluation_prompt   text,
  ADD COLUMN onboarding_surface      jsonb,
  ADD COLUMN qualification_rules     jsonb;

-- Index on code for fast lookups by structured ID
CREATE INDEX idx_tax_strategies_code ON public.tax_strategies (code) WHERE code IS NOT NULL;

-- Index on strategy_category for filtering
CREATE INDEX idx_tax_strategies_category ON public.tax_strategies (strategy_category) WHERE strategy_category IS NOT NULL;
