-- ============================================================
-- RoboTax Seed Data — 6 Categories + 42 Power-Ups
-- Consolidated per product roadmap integration sections
-- ============================================================
-- URL shortcuts used in comments:
-- SI = https://cdn.simpleicons.org/{slug}/{color}
-- GF = https://www.google.com/s2/favicons?sz=128&domain={domain}

-- ── Categories (6 consolidated) ────────────────────────────

insert into public.categories (id, label, icon, description, sort_order) values
  ('financial',  'Financial Accounts',   'landmark',      'Banks, brokerages, crypto, and retirement accounts (via Plaid)', 1),
  ('accounting', 'Accounting & Expenses','calculator',    'Accounting software and expense tracking',                       2),
  ('payroll',    'Payroll & Entity',     'users',         'Payroll providers, S-Corp tools, and health benefits',            3),
  ('r-and-d',    'R&D Evidence',         'flask-conical', 'Engineering and project management tools for R&D credits',        4),
  ('property',   'Property & Deductions','home',          'Real estate data, home office, and mileage tracking',            5),
  ('documents',  'Documents & Payments', 'file-text',     'Email, document storage, and payment processing',                6)
on conflict (id) do nothing;

-- ── Financial Accounts (13) — banks, brokerages, crypto, retirement ──

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('plaid',       'Plaid',           'Connect 12,000+ financial institutions in one click',   'financial', 'https://www.google.com/s2/favicons?sz=128&domain=plaid.com',           5),
  ('chase',       'Chase',           'Personal and business banking, credit cards',           'financial', 'https://cdn.simpleicons.org/chase/117ACA',                             4),
  ('boa',         'Bank of America', 'Checking, savings, and investment accounts',           'financial', 'https://cdn.simpleicons.org/bankofamerica/E31837',                     4),
  ('wells-fargo', 'Wells Fargo',     'Banking and financial services',                       'financial', 'https://cdn.simpleicons.org/wellsfargo/CD1409',                        3),
  ('fidelity',    'Fidelity',        'Brokerage, retirement, and investment accounts',       'financial', 'https://www.google.com/s2/favicons?sz=128&domain=fidelity.com',        4),
  ('robinhood',   'Robinhood',       'Commission-free stock and crypto trading',             'financial', 'https://cdn.simpleicons.org/robinhood/00C805',                         2),
  ('capital-one', 'Capital One',     'Banking, credit cards, and auto loans',                'financial', 'https://www.google.com/s2/favicons?sz=128&domain=www.capitalone.com',  3),
  ('coinbase',    'Coinbase',        'Crypto exchange — holdings and transaction history',   'financial', 'https://cdn.simpleicons.org/coinbase/0052FF',                          4),
  ('kraken',      'Kraken',          'Cryptocurrency exchange for loss harvesting',          'financial', 'https://www.google.com/s2/favicons?sz=128&domain=kraken.com',          3),
  ('gemini',      'Gemini',          'Regulated crypto exchange and custody',                'financial', 'https://www.google.com/s2/favicons?sz=128&domain=gemini.com',          3),
  ('binance-us',  'Binance.US',      'US-based crypto exchange',                             'financial', 'https://cdn.simpleicons.org/binance/F0B90B',                           2),
  ('vanguard',    'Vanguard',        'Retirement fund balances and contribution history',    'financial', 'https://www.google.com/s2/favicons?sz=128&domain=vanguard.com',        4),
  ('schwab',      'Schwab',          'Brokerage and retirement account data',                'financial', 'https://www.google.com/s2/favicons?sz=128&domain=schwab.com',          3)
on conflict (id) do update set logo_url = excluded.logo_url, description = excluded.description;

-- ── Accounting & Expenses (7) ──────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('quickbooks', 'QuickBooks',  'P&L, balance sheet, invoices, and expense tracking',          'accounting', 'https://cdn.simpleicons.org/quickbooks/2CA01C',                        5),
  ('xero',       'Xero',        'Cloud accounting for small businesses',                       'accounting', 'https://cdn.simpleicons.org/xero/13B5EA',                              4),
  ('freshbooks', 'FreshBooks',  'Invoicing, expenses, and time tracking',                      'accounting', 'https://www.google.com/s2/favicons?sz=128&domain=freshbooks.com',      3),
  ('wave',       'Wave',        'Free accounting and invoicing for small businesses',          'accounting', 'https://www.google.com/s2/favicons?sz=128&domain=waveapps.com',        2),
  ('sage',       'Sage',        'Enterprise accounting and financial management',              'accounting', 'https://cdn.simpleicons.org/sage/00DC82',                              3),
  ('expensify',  'Expensify',   'Receipt scanning, expense reports, and per-diem tracking',    'accounting', 'https://www.google.com/s2/favicons?sz=128&domain=expensify.com',       3),
  ('hurdlr',     'Hurdlr',      'Automatic mileage, expense, and income tracking',            'accounting', 'https://www.google.com/s2/favicons?sz=128&domain=hurdlr.com',          3)
on conflict (id) do update set logo_url = excluded.logo_url, description = excluded.description;

-- ── Payroll & Entity (7) — payroll, S-Corp, health benefits ─

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('adp',            'ADP',             'W-2 data, wages, FICA, contractor payments',                      'payroll', 'https://cdn.simpleicons.org/adp/D0271D',                              5),
  ('gusto',          'Gusto',           'Payroll, employee classifications, S-Corp payroll, 1099s',        'payroll', 'https://cdn.simpleicons.org/gusto/F45D22',                            4),
  ('paychex',        'Paychex',         'Payroll summaries and tax deposits',                              'payroll', 'https://cdn.simpleicons.org/paychex/004B87',                          3),
  ('rippling',       'Rippling',        'Unified payroll and HR platform',                                 'payroll', 'https://www.google.com/s2/favicons?sz=128&domain=rippling.com',        3),
  ('collective',     'Collective',      'S-Corp formation, bookkeeping, and tax filing for solopreneurs',  'payroll', 'https://www.google.com/s2/favicons?sz=128&domain=collective.com',      3),
  ('stride-health',  'Stride Health',   'Health insurance marketplace for self-employed',                  'payroll', 'https://www.google.com/s2/favicons?sz=128&domain=stridehealth.com',    4),
  ('healthcare-gov', 'Healthcare.gov',  'Federal marketplace plan data and subsidy eligibility',           'payroll', 'https://www.google.com/s2/favicons?sz=128&domain=healthcare.gov',      3)
on conflict (id) do update set logo_url = excluded.logo_url, description = excluded.description;

-- ── R&D Evidence (5) ───────────────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('jira',   'Jira',    'Sprint data and engineering hours for R&D credits',                  'r-and-d', 'https://cdn.simpleicons.org/jira/0052CC',                            4),
  ('github', 'GitHub',  'Commit history and PR activity for R&D evidence',                    'r-and-d', 'https://cdn.simpleicons.org/github/181717',                          4),
  ('gitlab', 'GitLab',  'CI/CD pipelines and merge request data for R&D documentation',      'r-and-d', 'https://cdn.simpleicons.org/gitlab/FC6D26',                          3),
  ('slack',  'Slack',   'R&D discussion evidence and contemporaneous documentation',          'r-and-d', 'https://www.google.com/s2/favicons?sz=128&domain=slack.com',          2),
  ('asana',  'Asana',   'Project timelines and task tracking for R&D activities',             'r-and-d', 'https://cdn.simpleicons.org/asana/F06A6A',                            2)
on conflict (id) do update set logo_url = excluded.logo_url;

-- ── Property & Deductions (7) — real estate, home office, mileage ──

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('zillow',    'Zillow',     'Property values and fair market estimates',                  'property', 'https://cdn.simpleicons.org/zillow/006AFF',                            3),
  ('redfin',    'Redfin',     'Real estate data and property valuations',                  'property', 'https://www.google.com/s2/favicons?sz=128&domain=redfin.com',          3),
  ('costar',    'CoStar',     'Commercial real estate data for cost segregation',          'property', 'https://www.google.com/s2/favicons?sz=128&domain=costar.com',          4),
  ('mileiq',    'MileIQ',     'Automatic mileage tracking with IRS-compliant reports',     'property', 'https://www.google.com/s2/favicons?sz=128&domain=mileiq.com',          3),
  ('everlance', 'Everlance',  'GPS mileage tracking and expense logging for gig workers', 'property', 'https://www.google.com/s2/favicons?sz=128&domain=everlance.com',       3)
on conflict (id) do update set logo_url = excluded.logo_url;

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight, is_native) values
  ('home-office-calc',   'Home Office Calculator',      'IRS simplified method — $5/sq ft, up to 300 sq ft ($1,500 max)', 'property', '', 3, true),
  ('home-office-actual', 'Home Office (Actual Method)',  'Track actual expenses — rent, utilities, insurance, depreciation', 'property', '', 4, true)
on conflict (id) do nothing;

-- ── Documents & Payments (3) ───────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('gmail',        'Gmail',        'Receipt scanning and vendor communications',    'documents', 'https://cdn.simpleicons.org/gmail/EA4335',        2),
  ('google-drive', 'Google Drive', 'Tax documents and financial statements',        'documents', 'https://cdn.simpleicons.org/googledrive/4285F4',  2),
  ('stripe',       'Stripe',       'Payment processing and revenue data',           'documents', 'https://cdn.simpleicons.org/stripe/635BFF',       3)
on conflict (id) do update set logo_url = excluded.logo_url;
