-- ============================================================
-- RoboTax Seed Data — 13 Categories + ~45 Power-Ups
-- ============================================================

-- ── Categories (7 original + 6 new) ────────────────────────

insert into public.categories (id, label, icon, description, sort_order) values
  ('financial',        'Financial',        'landmark',       'Banks, brokerages, and investment accounts',                  1),
  ('accounting',       'Accounting',       'calculator',     'Accounting and bookkeeping software',                         2),
  ('crypto',           'Crypto',           'bitcoin',        'Cryptocurrency exchanges and wallets',                        3),
  ('real-estate',      'Real Estate',      'home',           'Property data and valuations',                                4),
  ('payroll',          'Payroll',          'users',          'Payroll and HR systems',                                      5),
  ('r-and-d',          'R&D',              'flask-conical',  'Engineering tools for R&D tax credit evidence',               6),
  ('health-insurance', 'Health Insurance', 'heart-pulse',    'Health insurance plans and HSA accounts',                     7),
  ('retirement',       'Retirement',       'piggy-bank',     'Retirement accounts and investment portfolios',               8),
  ('expenses',         'Expenses',         'receipt',        'Expense tracking and receipt management',                     9),
  ('home-office',      'Home Office',      'laptop',         'Home office deduction tools and calculators',                10),
  ('mileage',          'Mileage',          'car',            'Mileage tracking for business vehicle deductions',           11),
  ('s-corp',           'S-Corp',           'building-2',     'S-Corp election, payroll, and entity optimization',          12),
  ('other',            'Other',            'puzzle',         'Email, documents, payments, and more',                       13)
on conflict (id) do nothing;

-- ── Power-Ups: Financial (7) ───────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('plaid',       'Plaid',           'Connect 12,000+ financial institutions in one click',  'financial', 'https://cdn.simpleicons.org/plaid/00D09C',          5),
  ('chase',       'Chase',           'Personal and business banking, credit cards',          'financial', 'https://cdn.simpleicons.org/chase/117ACA',          4),
  ('boa',         'Bank of America', 'Checking, savings, and investment accounts',           'financial', 'https://cdn.simpleicons.org/bankofamerica/E31837',  4),
  ('wells-fargo', 'Wells Fargo',     'Banking and financial services',                       'financial', 'https://cdn.simpleicons.org/wellsfargo/CD1409',     3),
  ('fidelity',    'Fidelity',        'Brokerage and retirement accounts',                    'financial', 'https://cdn.simpleicons.org/fidelity/4B8B3B',       4),
  ('robinhood',   'Robinhood',       'Commission-free stock and crypto trading',             'financial', 'https://cdn.simpleicons.org/robinhood/00C805',      2),
  ('capital-one', 'Capital One',     'Banking, credit cards, and auto loans',                'financial', 'https://cdn.simpleicons.org/capitalone/D03027',     3)
on conflict (id) do nothing;

-- ── Power-Ups: Accounting (5) ──────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('quickbooks', 'QuickBooks',  'P&L, balance sheet, chart of accounts, invoices',     'accounting', 'https://cdn.simpleicons.org/quickbooks/2CA01C',  5),
  ('xero',       'Xero',        'Cloud accounting for small businesses',               'accounting', 'https://cdn.simpleicons.org/xero/13B5EA',        4),
  ('freshbooks', 'FreshBooks',  'Invoicing, expenses, and time tracking',              'accounting', 'https://cdn.simpleicons.org/freshbooks/0075DD',  3),
  ('wave',       'Wave',        'Free accounting and invoicing for small businesses',  'accounting', 'https://cdn.simpleicons.org/wave/3F51B5',        2),
  ('sage',       'Sage',        'Enterprise accounting and financial management',      'accounting', 'https://cdn.simpleicons.org/sage/00DC82',        3)
on conflict (id) do nothing;

-- ── Power-Ups: Crypto (4) ──────────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('coinbase',   'Coinbase',    'Crypto exchange — holdings and transaction history',   'crypto', 'https://cdn.simpleicons.org/coinbase/0052FF',  4),
  ('kraken',     'Kraken',      'Cryptocurrency exchange for loss harvesting',          'crypto', 'https://cdn.simpleicons.org/kraken/5741D9',    3),
  ('gemini',     'Gemini',      'Regulated crypto exchange and custody',                'crypto', 'https://cdn.simpleicons.org/gemini/00DCFA',    3),
  ('binance-us', 'Binance.US',  'US-based crypto exchange',                             'crypto', 'https://cdn.simpleicons.org/binance/F0B90B',   2)
on conflict (id) do nothing;

-- ── Power-Ups: Real Estate (3) ─────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('zillow', 'Zillow', 'Property values and fair market estimates',              'real-estate', 'https://cdn.simpleicons.org/zillow/006AFF',  3),
  ('redfin', 'Redfin', 'Real estate data and property valuations',              'real-estate', 'https://cdn.simpleicons.org/redfin/A02021',  3),
  ('costar', 'CoStar', 'Commercial real estate data for cost segregation',      'real-estate', 'https://cdn.simpleicons.org/costar/003DA5',  4)
on conflict (id) do nothing;

-- ── Power-Ups: Payroll (4) ─────────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('adp',      'ADP',      'W-2 data, wages, FICA, contractor payments',    'payroll', 'https://cdn.simpleicons.org/adp/D0271D',       5),
  ('gusto',    'Gusto',    'Payroll, employee classifications, 1099 data',  'payroll', 'https://cdn.simpleicons.org/gusto/F45D22',     4),
  ('paychex',  'Paychex',  'Payroll summaries and tax deposits',            'payroll', 'https://cdn.simpleicons.org/paychex/004B87',   3),
  ('rippling', 'Rippling', 'Unified payroll and HR platform',               'payroll', 'https://cdn.simpleicons.org/rippling/6C2BD9',  3)
on conflict (id) do nothing;

-- ── Power-Ups: R&D (5) ────────────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('jira',   'Jira',    'Sprint data and engineering hours for R&D credits',                  'r-and-d', 'https://cdn.simpleicons.org/jira/0052CC',    4),
  ('github', 'GitHub',  'Commit history and PR activity for R&D evidence',                    'r-and-d', 'https://cdn.simpleicons.org/github/181717',  4),
  ('gitlab', 'GitLab',  'CI/CD pipelines and merge request data for R&D documentation',      'r-and-d', 'https://cdn.simpleicons.org/gitlab/FC6D26',  3),
  ('slack',  'Slack',   'R&D discussion evidence and contemporaneous documentation',          'r-and-d', 'https://cdn.simpleicons.org/slack/4A154B',   2),
  ('asana',  'Asana',   'Project timelines and task tracking for R&D activities',             'r-and-d', 'https://cdn.simpleicons.org/asana/F06A6A',   2)
on conflict (id) do nothing;

-- ── Power-Ups: Health Insurance (2) — NEW ──────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('stride-health',  'Stride Health',   'Health insurance marketplace for self-employed — find ACA plans and maximize premium tax credits', 'health-insurance', 'https://cdn.simpleicons.org/stripe/6C63FF', 4),
  ('healthcare-gov', 'Healthcare.gov',  'Federal marketplace plan data — verify ACA enrollment and subsidy eligibility',                    'health-insurance', 'https://cdn.simpleicons.org/gov/0071BC',    3)
on conflict (id) do nothing;

-- ── Power-Ups: Retirement (3) — NEW ────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('fidelity-retirement', 'Fidelity (Retirement)', 'Solo 401(k) and SEP-IRA contribution tracking via Plaid',      'retirement', 'https://cdn.simpleicons.org/fidelity/4B8B3B',          4),
  ('vanguard',            'Vanguard',              'Retirement fund balances and contribution history via Plaid',   'retirement', 'https://cdn.simpleicons.org/vanguard/C41230',           4),
  ('schwab',              'Schwab',                'Brokerage and retirement account data via Plaid',               'retirement', 'https://cdn.simpleicons.org/charleschwab/00A0DF',       3)
on conflict (id) do nothing;

-- ── Power-Ups: Expenses (3) — NEW ──────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('quickbooks-expenses', 'QuickBooks (Expenses)', 'Categorized business expenses synced from QuickBooks Online',           'expenses', 'https://cdn.simpleicons.org/quickbooks/2CA01C',   4),
  ('expensify',           'Expensify',             'Receipt scanning, expense reports, and per-diem tracking',              'expenses', 'https://cdn.simpleicons.org/expensify/0D2714',    3),
  ('hurdlr',              'Hurdlr',                'Automatic mileage, expense, and income tracking for freelancers',      'expenses', 'https://cdn.simpleicons.org/hurdlr/00C48C',       3)
on conflict (id) do nothing;

-- ── Power-Ups: Home Office (2) — NEW ───────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight, is_native) values
  ('home-office-calc',     'Home Office Calculator',     'IRS simplified method — $5/sq ft, up to 300 sq ft ($1,500 max deduction)',  'home-office', '', 3, true),
  ('home-office-actual',   'Home Office (Actual Method)', 'Track actual expenses — rent, utilities, insurance, depreciation',          'home-office', '', 4, true)
on conflict (id) do nothing;

-- ── Power-Ups: Mileage (3) — NEW ──────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('mileiq',    'MileIQ',    'Automatic mileage tracking with IRS-compliant reports',              'mileage', 'https://cdn.simpleicons.org/microsoft/00A4EF',   3),
  ('everlance', 'Everlance', 'GPS mileage tracking and expense logging for gig workers',          'mileage', 'https://cdn.simpleicons.org/everlance/00D09C',   3),
  ('hurdlr-mi', 'Hurdlr (Mileage)', 'Automatic trip detection and mileage deduction calculation', 'mileage', 'https://cdn.simpleicons.org/hurdlr/00C48C',      2)
on conflict (id) do nothing;

-- ── Power-Ups: S-Corp (2) — NEW ───────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('gusto-scorp', 'Gusto (S-Corp Payroll)', 'Embedded payroll for S-Corp reasonable salary — reduce self-employment tax', 's-corp', 'https://cdn.simpleicons.org/gusto/F45D22',        4),
  ('collective',  'Collective',             'All-in-one S-Corp formation, bookkeeping, and tax filing for solopreneurs', 's-corp', 'https://cdn.simpleicons.org/collective/6C63FF',   3)
on conflict (id) do nothing;

-- ── Power-Ups: Other (3) ──────────────────────────────────

insert into public.power_ups (id, name, description, category_id, logo_url, savings_weight) values
  ('gmail',        'Gmail',        'Receipt scanning and vendor communications',    'other', 'https://cdn.simpleicons.org/gmail/EA4335',        2),
  ('google-drive', 'Google Drive', 'Tax documents and financial statements',        'other', 'https://cdn.simpleicons.org/googledrive/4285F4',  2),
  ('stripe',       'Stripe',       'Payment processing and revenue data',           'other', 'https://cdn.simpleicons.org/stripe/635BFF',       3)
on conflict (id) do nothing;
