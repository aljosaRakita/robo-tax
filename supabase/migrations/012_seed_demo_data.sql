-- ============================================================
-- Migration 012: Seed Demo Data (Meridian Manufacturing)

-- ============================================================

-- Use a transaction variable for the demo user ID.
-- Before running, replace the placeholder with the real UUID.
DO $$
DECLARE
  demo_uid uuid := 'b3d0ad2b-f8ae-4468-a13f-a014bb7455ff';
  tid_rnd  uuid;
  tid_scorp uuid;
  tid_costseg uuid;
  tid_solo401k uuid;
  tid_sec179 uuid;
  tid_qbi uuid;
  tid_augusta uuid;
  tid_family uuid;
  tid_homeoffice uuid;
  tid_accountable uuid;
BEGIN

  -- ========================================
  -- 3a. profiles row
  -- ========================================
  INSERT INTO public.profiles (id, name, email_verified, phone_verified)
  VALUES (demo_uid, 'Meridian Manufacturing', true, false)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email_verified = EXCLUDED.email_verified;

  -- ========================================
  -- 3b. integration_data — pre-seeded provider data
  -- ========================================
  INSERT INTO public.integration_data (user_id, provider, data_type, data, fetched_at, is_stale)
  VALUES (
    demo_uid,
    'meridian',
    'profile',
    '{
      "company": "Meridian Manufacturing",
      "business_income": 420000,
      "employees": 14,
      "warehouse_value": 2400000,
      "reasonable_compensation": 130000,
      "qres": 310000,
      "equipment_purchases": 95000,
      "home_expenses": 50000,
      "home_office_pct": 0.15,
      "business_expenses": 38000,
      "children_employed": 2,
      "child_wages": 15000,
      "augusta_days": 8,
      "augusta_fmv": 3500,
      "entity_type": "s-corp",
      "state": "OH"
    }'::jsonb,
    now(),
    false
  )
  ON CONFLICT (user_id, provider, data_type) DO UPDATE SET
    data = EXCLUDED.data,
    fetched_at = now(),
    is_stale = false;

  -- ========================================
  -- 3c. strategy_triggers — 10 triggers with fixed: formulas
  -- ========================================

  -- R&D Tax Credit
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('r-and-d-credit', 'meridian', 'profile', '{}', 'fixed:43400', '$310K QREs x 14% ASC method = $43,400 tax credit', true)
  RETURNING id INTO tid_rnd;

  -- S-Corp Election
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('s-corp-election', 'meridian', 'profile', '{}', 'fixed:38000', '$420K - $130K reasonable comp = $290K x 15.3% FICA', true)
  RETURNING id INTO tid_scorp;

  -- Cost Segregation
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('cost-segregation', 'meridian', 'profile', '{}', 'fixed:150000', '$2.4M warehouse x 25% reclassification x 37%', true)
  RETURNING id INTO tid_costseg;

  -- Solo 401(k)
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('solo-401k', 'meridian', 'profile', '{}', 'fixed:25900', 'Solo 401(k) $70K total x 37%', true)
  RETURNING id INTO tid_solo401k;

  -- Section 179
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('section-179', 'meridian', 'profile', '{}', 'fixed:35150', '$95K equipment x 37% marginal rate', true)
  RETURNING id INTO tid_sec179;

  -- QBI Deduction
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('qbi-deduction', 'meridian', 'profile', '{}', 'fixed:31080', '$420K QBI x 20% x 37% (OBBBA confirmed)', true)
  RETURNING id INTO tid_qbi;

  -- Augusta Rule
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('augusta-rule', 'meridian', 'profile', '{}', 'fixed:18130', '8 days x $3,500 FMV = $28K excluded x 37%', true)
  RETURNING id INTO tid_augusta;

  -- Family Employment
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('family-employment', 'meridian', 'profile', '{}', 'fixed:11100', '2 children x $15K wages x 37%', true)
  RETURNING id INTO tid_family;

  -- Home Office Deduction
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('home-office-deduction', 'meridian', 'profile', '{}', 'fixed:7500', '15% x $50K home expenses', true)
  RETURNING id INTO tid_homeoffice;

  -- Accountable Plan
  INSERT INTO public.strategy_triggers (strategy_id, provider, data_type, condition, savings_formula, description, enabled)
  VALUES ('accountable-plan', 'meridian', 'profile', '{}', 'fixed:14000', '$38K business expenses x 37%', true)
  RETURNING id INTO tid_accountable;

  -- ========================================
  -- 3d. user_strategy_matches — pre-seeded results
  -- ========================================

  -- Clear any existing matches for demo user
  DELETE FROM public.user_strategy_matches WHERE user_id = demo_uid;

  INSERT INTO public.user_strategy_matches
    (user_id, strategy_id, trigger_id, estimated_low, estimated_base, estimated_high, confidence, reasoning, evidence, status)
  VALUES
    (demo_uid, 'cost-segregation',     tid_costseg,    120000, 150000, 195000, 88, '$2.4M warehouse x 25% reclassification x 37%', '{"warehouse_value":2400000}', 'identified'),
    (demo_uid, 'r-and-d-credit',       tid_rnd,        34720, 43400, 56420, 95, '$310K QREs x 14% ASC method = $43,400 tax credit', '{"qres":310000}', 'identified'),
    (demo_uid, 's-corp-election',      tid_scorp,      30400, 38000, 49400, 92, '$420K - $130K reasonable comp = $290K x 15.3% FICA', '{"business_income":420000}', 'identified'),
    (demo_uid, 'section-179',          tid_sec179,     28120, 35150, 45695, 88, '$95K equipment x 37% marginal rate', '{"equipment_purchases":95000}', 'identified'),
    (demo_uid, 'qbi-deduction',        tid_qbi,        24864, 31080, 40404, 90, '$420K QBI x 20% x 37% (OBBBA confirmed)', '{"business_income":420000}', 'identified'),
    (demo_uid, 'solo-401k',            tid_solo401k,   20720, 25900, 33670, 90, 'Solo 401(k) $70K total x 37%', '{}', 'identified'),
    (demo_uid, 'augusta-rule',         tid_augusta,    13598, 18130, 23569, 75, '8 days x $3,500 FMV = $28K excluded x 37%', '{"augusta_days":8}', 'identified'),
    (demo_uid, 'accountable-plan',     tid_accountable,10920, 14000, 18200, 78, '$38K business expenses x 37%', '{"business_expenses":38000}', 'identified'),
    (demo_uid, 'family-employment',    tid_family,     8880, 11100, 14430, 82, '2 children x $15K wages x 37%', '{"children_employed":2}', 'identified'),
    (demo_uid, 'home-office-deduction',tid_homeoffice, 6000, 7500, 9750, 80, '15% x $50K home expenses', '{"home_expenses":50000}', 'identified');

END $$;
