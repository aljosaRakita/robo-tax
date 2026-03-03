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
  ('gusto',          'Gusto',           'Payroll, employee classifications, S-Corp payroll, 1099s',        'payroll', 'https://cdn.simpleicons.org/gusto/F45D22',                            5),
  ('adp',            'ADP',             'W-2 data, wages, FICA, contractor payments',                      'payroll', 'https://cdn.simpleicons.org/adp/D0271D',                              4),
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

-- ============================================================
-- Tax Strategies (50) — standalone reference table
-- ============================================================

insert into public.tax_strategies (id, title, workflow, priority) values
  -- Deductions & Write-Offs
  ('max-401k',              'Maximize 401(k) Contributions',           '1. Confirm employer plan limits ($23,500 for 2026, +$7,500 catch-up if 50+). 2. Increase payroll deferral to max. 3. Verify contributions on year-end W-2.', 5),
  ('solo-401k',             'Open a Solo 401(k)',                      '1. Establish plan before Dec 31 for current-year eligibility. 2. Contribute as both employee ($23,500) and employer (25% of net SE income). 3. File Form 5500-EZ if assets exceed $250K.', 5),
  ('sep-ira',               'Fund a SEP-IRA',                         '1. Calculate max contribution (25% of net SE income, up to $69,000). 2. Open SEP-IRA at brokerage. 3. Contribute by tax filing deadline (including extensions).', 4),
  ('backdoor-roth',         'Backdoor Roth IRA Conversion',           '1. Contribute $7,000 to a traditional IRA (non-deductible). 2. Convert to Roth IRA immediately. 3. File Form 8606 with tax return. 4. Ensure no existing pre-tax IRA balances to avoid pro-rata rule.', 4),
  ('mega-backdoor-roth',    'Mega Backdoor Roth',                     '1. Verify employer 401(k) allows after-tax contributions and in-service withdrawals. 2. Contribute after-tax dollars up to $69,000 total limit. 3. Roll over to Roth IRA or Roth 401(k).', 3),
  ('hsa-triple-tax',        'HSA Triple Tax Advantage',               '1. Enroll in HDHP. 2. Contribute max ($4,300 individual / $8,550 family for 2026). 3. Pay medical expenses out-of-pocket and let HSA grow tax-free. 4. Keep receipts for future reimbursement.', 5),
  ('home-office-deduction', 'Claim Home Office Deduction',            '1. Measure dedicated office space square footage. 2. Choose simplified method ($5/sq ft, max 300 sq ft) or actual expense method. 3. File Form 8829 with Schedule C.', 4),
  ('vehicle-deduction',     'Vehicle Expense Deduction',              '1. Track all business miles with a mileage app (MileIQ, Everlance). 2. Choose standard mileage rate (70 cents/mile for 2026) or actual expenses. 3. Keep contemporaneous mileage log.', 4),
  ('qbi-deduction',         'Qualified Business Income (QBI) Deduction', '1. Determine if business qualifies (pass-through entity, under income threshold). 2. Calculate 20% of qualified business income. 3. Ensure W-2 wages and property basis meet safe harbors if above threshold.', 5),
  ('charitable-bunching',   'Charitable Contribution Bunching',       '1. Calculate two years of planned charitable giving. 2. Bunch into one tax year to exceed standard deduction. 3. Use donor-advised fund (DAF) for immediate deduction with flexible grant timing.', 3),
  ('daf-appreciated-stock', 'Donate Appreciated Stock to DAF',        '1. Identify stock held >1 year with large unrealized gains. 2. Transfer shares directly to donor-advised fund. 3. Deduct full FMV, avoid capital gains tax entirely.', 4),
  ('state-salt-workaround', 'SALT Cap Workaround (PTE Election)',     '1. Check if your state offers a pass-through entity tax election. 2. Elect PTE-level tax payment. 3. Claim credit on personal return, effectively bypassing $10K SALT cap.', 4),

  -- Entity Structure & S-Corp
  ('s-corp-election',       'S-Corp Election for SE Tax Savings',     '1. Form LLC and file Form 2553 for S-Corp election. 2. Set reasonable salary (40-60% of profits). 3. Take remaining profits as distributions, saving 15.3% SE tax on distributions.', 5),
  ('reasonable-salary',     'Optimize S-Corp Reasonable Salary',      '1. Research comparable salaries on BLS/Glassdoor. 2. Document rationale for salary level. 3. Run payroll consistently. 4. Balance between salary (higher = more SE tax) and distributions (too low = IRS audit risk).', 4),
  ('family-employment',     'Employ Family Members',                  '1. Hire spouse/children for legitimate business tasks. 2. Pay reasonable wages (children under 18 exempt from FICA if sole proprietor). 3. Shift income to lower tax brackets. 4. Fund their retirement accounts.', 3),
  ('accountable-plan',      'Set Up an Accountable Plan',             '1. Create written accountable plan policy for S-Corp. 2. Reimburse business expenses (home office, phone, internet) tax-free. 3. Employee substantiates expenses within 60 days. 4. Return excess within 120 days.', 3),
  ('augusta-rule',          'Augusta Rule (14-Day Rental)',            '1. Rent your home to your business for up to 14 days/year for board meetings or events. 2. Charge fair market rental rate. 3. Income is tax-free to you personally. 4. Business deducts rental expense.', 2),

  -- Credits
  ('r-and-d-credit',        'R&D Tax Credit (Section 41)',             '1. Identify qualifying research activities (developing new products, processes, software). 2. Document employee time, supplies, and contractor costs. 3. Calculate credit using regular or simplified method. 4. File Form 6765.', 5),
  ('r-and-d-startup-offset','R&D Credit Against Payroll Tax',          '1. Confirm qualifying small business status (<$5M gross receipts, ≤5 years). 2. Elect on Form 6765 to apply credit against payroll taxes. 3. Offset up to $500K/year in employer FICA.', 4),
  ('ev-tax-credit',         'Electric Vehicle Tax Credit',             '1. Verify vehicle qualifies under current IRA clean vehicle rules. 2. Check income limits ($150K single / $300K MFJ for new). 3. Claim up to $7,500 credit on Form 8936. 4. Consider point-of-sale transfer to dealer.', 3),
  ('energy-efficiency',     'Energy-Efficient Home Improvement Credit','1. Install qualifying improvements (heat pumps, insulation, windows, doors). 2. Keep manufacturer certification statements. 3. Claim 30% credit up to $3,200/year on Form 5695.', 3),
  ('child-tax-credit',      'Maximize Child Tax Credit',              '1. Verify qualifying children under 17. 2. Claim $2,000 per child ($1,700 refundable). 3. Adjust withholding mid-year if needed. 4. Check phase-out at $200K single / $400K MFJ.', 4),
  ('dependent-care-fsa',    'Dependent Care FSA',                     '1. Enroll during open enrollment for up to $5,000/year (MFJ). 2. Use for daycare, preschool, after-school care, summer camp. 3. Reduces taxable income dollar-for-dollar.', 3),
  ('education-credits',     'Education Tax Credits (AOC/LLC)',         '1. Determine eligibility for American Opportunity Credit ($2,500/yr, first 4 years) or Lifetime Learning Credit ($2,000/yr). 2. Collect Form 1098-T from institution. 3. File Form 8863.', 3),

  -- Real Estate & Depreciation
  ('cost-segregation',      'Cost Segregation Study',                 '1. Hire a qualified cost segregation engineer. 2. Reclassify building components into 5, 7, and 15-year property. 3. Apply bonus depreciation to accelerated components. 4. Amend prior returns if applicable.', 5),
  ('bonus-depreciation',    'Bonus Depreciation on Assets',           '1. Identify qualifying assets placed in service (equipment, vehicles, software). 2. Apply 60% bonus depreciation for 2026. 3. Consider Section 179 for remaining amount. 4. File Form 4562.', 4),
  ('section-179',           'Section 179 Expensing',                  '1. Purchase qualifying business equipment or software. 2. Deduct up to $1,220,000 in the year placed in service. 3. Must have taxable income to use (cannot create a loss). 4. Report on Form 4562.', 4),
  ('real-estate-pro',       'Real Estate Professional Status',        '1. Spend 750+ hours in real estate activities. 2. More than half of personal services must be in real estate. 3. Materially participate in each rental activity (or group election). 4. Unlock unlimited passive loss deductions.', 4),
  ('1031-exchange',         '1031 Like-Kind Exchange',                '1. Identify replacement property within 45 days of sale. 2. Close on replacement within 180 days. 3. Use qualified intermediary to hold funds. 4. Defer all capital gains and depreciation recapture.', 5),
  ('opportunity-zone',      'Qualified Opportunity Zone Investment',  '1. Invest capital gains into a Qualified Opportunity Fund within 180 days. 2. Hold for 10+ years to eliminate tax on QOZ appreciation. 3. File Form 8949 and 8997.', 3),
  ('short-term-rental',     'Short-Term Rental Loophole',             '1. Keep average guest stay under 7 days. 2. Materially participate (100+ hours, more than anyone else). 3. Activity is non-passive — losses offset W-2/active income. 4. Combine with cost segregation for large Year 1 deductions.', 4),
  ('rental-loss-allowance',  'Rental Loss $25K Allowance',            '1. Actively participate in rental property management. 2. Ensure AGI is under $100K (phases out to $150K). 3. Deduct up to $25K of rental losses against ordinary income.', 3),

  -- Capital Gains & Investments
  ('tax-loss-harvesting',   'Tax-Loss Harvesting',                    '1. Review portfolio for positions with unrealized losses. 2. Sell losing positions to realize losses. 3. Reinvest in similar (not substantially identical) assets. 4. Deduct up to $3,000 net loss against income, carry forward excess.', 4),
  ('long-term-cap-gains',   'Hold Investments for Long-Term Rates',   '1. Identify positions approaching 1-year holding period. 2. Delay sales until long-term treatment applies. 3. Benefit from 0%, 15%, or 20% rate vs. ordinary income rates.', 3),
  ('zero-cap-gains-bracket','0% Capital Gains Bracket',               '1. Calculate taxable income after deductions. 2. If under $47,025 single / $94,050 MFJ, long-term gains taxed at 0%. 3. Strategically realize gains in low-income years (sabbatical, early retirement).', 3),
  ('crypto-loss-harvesting','Crypto Tax-Loss Harvesting',             '1. Identify crypto positions with unrealized losses. 2. Sell and immediately repurchase (no wash sale rule for crypto). 3. Realize loss for tax purposes while maintaining position.', 3),
  ('nua-strategy',          'Net Unrealized Appreciation (NUA)',       '1. Distribute company stock from 401(k) in-kind (not rolled to IRA). 2. Pay ordinary income tax only on cost basis. 3. Appreciation taxed at long-term capital gains rate when sold.', 2),

  -- Estimated Taxes & Withholding
  ('estimated-tax-planning','Quarterly Estimated Tax Planning',       '1. Calculate expected tax liability for the year. 2. Pay quarterly estimates (Apr 15, Jun 15, Sep 15, Jan 15). 3. Use safe harbor (110% of prior year tax) to avoid penalties. 4. Adjust Q3/Q4 if income changes.', 4),
  ('withholding-optimization','Optimize W-4 Withholding',            '1. Use IRS Tax Withholding Estimator. 2. Account for side income, deductions, and credits. 3. Adjust W-4 to minimize refund (interest-free loan to IRS) without underpaying.', 3),
  ('annual-tax-projection', 'Mid-Year Tax Projection',                '1. Run a tax projection in July with YTD income and deductions. 2. Identify shortfalls or overpayments. 3. Adjust estimated payments or withholding for remainder of year.', 3),

  -- Retirement & Estate
  ('roth-conversion-ladder','Roth Conversion Ladder',                 '1. In low-income years, convert traditional IRA to Roth up to top of current bracket. 2. Pay tax now at low rate. 3. Future growth and withdrawals are tax-free. 4. Ideal during early retirement or gap years.', 4),
  ('defined-benefit-plan',  'Defined Benefit Plan',                   '1. Set up a cash balance or traditional DB plan through a TPA. 2. Contribute up to $265,000/year (age-dependent). 3. Deduct contributions as business expense. 4. Best for high-income business owners over 40.', 4),
  ('ira-contribution-timing','Strategic IRA Contribution Timing',     '1. Contribute to IRA early in the year for maximum growth. 2. You have until April 15 to make prior-year contributions. 3. Consider Roth vs. traditional based on current vs. expected future tax rate.', 2),
  ('inherited-ira-planning','Inherited IRA 10-Year Rule Planning',    '1. Non-spouse beneficiaries must withdraw within 10 years (SECURE Act). 2. Spread withdrawals across years to manage bracket impact. 3. Coordinate with other income for optimal timing.', 2),
  ('gift-tax-exclusion',    'Annual Gift Tax Exclusion',              '1. Gift up to $18,000/person/year ($36,000 with spouse gift-splitting). 2. No gift tax return required for exclusion amounts. 3. Reduces taxable estate. 4. Consider 529 superfunding (5-year election).', 2),

  -- Business Operations
  ('retirement-plan-credit','Small Business Retirement Plan Credit',  '1. Start a new retirement plan (401k, SIMPLE, SEP). 2. Claim up to $5,000/year credit for first 3 years of plan admin costs. 3. Additional $500 credit for auto-enrollment. 4. File Form 8881.', 3),
  ('health-insurance-deduction','Self-Employed Health Insurance Deduction', '1. Confirm no employer-subsidized plan available. 2. Deduct 100% of premiums for self, spouse, and dependents. 3. Claim on Schedule 1 (above-the-line deduction, reduces AGI).', 4),
  ('defer-income',          'Defer Income to Next Year',              '1. Delay invoicing or project completion until January. 2. Accelerate deductible expenses into current year. 3. Effective for cash-basis taxpayers expecting lower income next year.', 3),
  ('accelerate-deductions', 'Accelerate Deductions into Current Year','1. Prepay state taxes, business expenses, or rent before Dec 31. 2. Make Q4 estimated tax payment early. 3. Stock up on business supplies. 4. Most effective when expecting lower income next year.', 3),
  ('hobby-loss-rules',      'Avoid Hobby Loss Classification',        '1. Show profit in 3 of 5 consecutive years. 2. Keep professional records and separate bank account. 3. Document business intent, marketing efforts, and expertise development. 4. Maintain business plan.', 2)
on conflict (id) do nothing;

-- ============================================================
-- Strategy Triggers — map (provider, data_type) → strategies
-- with conditions and savings formulas
-- ============================================================

insert into public.strategy_triggers
  (strategy_id, provider, data_type, condition, savings_formula, savings_floor, savings_ceiling, requires_all, description)
values
  -- ── Plaid / Financial ─────────────────────────────────────

  -- Tax-Loss Harvesting: holdings with unrealized losses
  ('tax-loss-harvesting', 'plaid', 'holdings',
   '{"field": "total_unrealized_loss", "op": "lt", "value": 0}',
   'total_unrealized_loss * -0.35', 500, 50000, '{}',
   'Unrealized losses in brokerage accounts can be harvested to offset capital gains'),

  -- Tax-Loss Harvesting: from transaction history showing sell at loss
  ('tax-loss-harvesting', 'plaid', 'transactions',
   '{"field": "investment_sell_loss_total", "op": "lt", "value": 0}',
   'investment_sell_loss_total * -0.30', 200, 30000, '{}',
   'Historical sell transactions at a loss indicate harvesting opportunity'),

  -- Crypto Tax-Loss Harvesting: crypto holdings with losses
  ('crypto-loss-harvesting', 'plaid', 'holdings',
   '{"field": "crypto_unrealized_loss", "op": "lt", "value": 0}',
   'crypto_unrealized_loss * -0.35', 200, 25000, '{}',
   'Unrealized crypto losses can be harvested (no wash-sale rule for crypto)'),

  -- Long-Term Capital Gains: holdings held > 1 year
  ('long-term-cap-gains', 'plaid', 'holdings',
   '{"field": "long_term_gain", "op": "gt", "value": 0}',
   'long_term_gain * 0.12', 100, 20000, '{}',
   'Long-term holdings qualify for preferential capital gains rates'),

  -- 0% Capital Gains Bracket
  ('zero-cap-gains-bracket', 'plaid', 'holdings',
   '{"and": [{"field": "total_gain", "op": "gt", "value": 0}, {"field": "estimated_income", "op": "lt", "value": 89250}]}',
   'total_gain * 0.15', 100, 15000, '{}',
   'Low income + capital gains may qualify for 0% rate'),

  -- HSA Triple Tax Advantage: checking if HSA-eligible plan connected
  ('hsa-triple-tax', 'plaid', 'accounts',
   '{"field": "has_hsa_account", "op": "eq", "value": true}',
   'fixed:3850', 1000, 7750, '{}',
   'HSA account detected — maximize contributions for triple tax benefit'),

  -- Backdoor Roth: traditional IRA detected with high income
  ('backdoor-roth', 'plaid', 'accounts',
   '{"and": [{"field": "has_ira", "op": "eq", "value": true}, {"field": "estimated_income", "op": "gt", "value": 153000}]}',
   'fixed:6500', 1000, 6500, '{}',
   'Traditional IRA + high income suggests backdoor Roth opportunity'),

  -- Maximize 401(k)
  ('max-401k', 'plaid', 'accounts',
   '{"field": "has_401k", "op": "eq", "value": true}',
   'fixed:8250', 3000, 23000, '{}',
   '401(k) account detected — ensure maxing out contributions saves on taxes'),

  -- Solo 401(k): self-employment income + no 401k
  ('solo-401k', 'plaid', 'transactions',
   '{"and": [{"field": "self_employment_income", "op": "gt", "value": 20000}, {"field": "has_401k", "op": "eq", "value": false}]}',
   'self_employment_income * 0.20', 3000, 66000, '{}',
   'Self-employment income without 401(k) suggests Solo 401(k) opportunity'),

  -- SEP-IRA
  ('sep-ira', 'plaid', 'transactions',
   '{"field": "self_employment_income", "op": "gt", "value": 10000}',
   'self_employment_income * 0.25', 2000, 66000, '{}',
   'Self-employment income qualifies for SEP-IRA contributions'),

  -- Retirement plan from account balances
  ('roth-conversion-ladder', 'plaid', 'accounts',
   '{"and": [{"field": "traditional_ira_balance", "op": "gt", "value": 10000}, {"field": "estimated_income", "op": "lt", "value": 100000}]}',
   'traditional_ira_balance * 0.08', 500, 20000, '{}',
   'Traditional IRA balance in low-income year suggests Roth conversion'),

  -- Estimated tax planning from transaction patterns
  ('estimated-tax-planning', 'plaid', 'transactions',
   '{"field": "self_employment_income", "op": "gt", "value": 5000}',
   'fixed:2000', 500, 5000, '{}',
   'Self-employment income detected — quarterly estimated payments avoid penalties'),

  -- Charitable bunching from donation transactions
  ('charitable-bunching', 'plaid', 'transactions',
   '{"field": "charitable_total", "op": "gt", "value": 5000}',
   'charitable_total * 0.30', 500, 15000, '{}',
   'Significant charitable giving detected — bunching can maximize deductions'),

  -- Donate Appreciated Stock
  ('daf-appreciated-stock', 'plaid', 'holdings',
   '{"and": [{"field": "long_term_gain", "op": "gt", "value": 5000}, {"field": "charitable_total", "op": "gt", "value": 2000}]}',
   'long_term_gain * 0.20', 1000, 25000, '{}',
   'Appreciated stock + charitable giving = donate stock to avoid cap gains'),

  -- ── QuickBooks / Accounting ───────────────────────────────

  -- QBI Deduction: qualified business income
  ('qbi-deduction', 'quickbooks', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 10000}',
   'net_income * 0.20', 2000, 50000, '{}',
   'Qualified business income detected for 20% QBI deduction'),

  -- Home Office from expense categories
  ('home-office-deduction', 'quickbooks', 'expenses',
   '{"field": "home_office_expenses", "op": "gt", "value": 0}',
   'home_office_expenses * 0.30', 500, 1500, '{}',
   'Home office expenses found in accounting records'),

  -- Vehicle Deduction
  ('vehicle-deduction', 'quickbooks', 'expenses',
   '{"field": "vehicle_expenses", "op": "gt", "value": 500}',
   'vehicle_expenses * 0.40', 500, 10000, '{}',
   'Vehicle expenses detected in accounting — standard mileage or actual method'),

  -- Section 179 Expensing
  ('section-179', 'quickbooks', 'expenses',
   '{"field": "equipment_purchases", "op": "gt", "value": 2000}',
   'equipment_purchases * 0.30', 600, 50000, '{}',
   'Equipment purchases qualify for Section 179 immediate expensing'),

  -- Bonus Depreciation
  ('bonus-depreciation', 'quickbooks', 'expenses',
   '{"field": "asset_purchases", "op": "gt", "value": 5000}',
   'asset_purchases * 0.25', 1000, 100000, '{}',
   'Capital asset purchases qualify for bonus depreciation'),

  -- Accountable Plan
  ('accountable-plan', 'quickbooks', 'expenses',
   '{"field": "reimbursable_expenses", "op": "gt", "value": 1000}',
   'reimbursable_expenses * 0.30', 300, 10000, '{}',
   'Reimbursable expenses detected — accountable plan makes them tax-free'),

  -- Accelerate Deductions
  ('accelerate-deductions', 'quickbooks', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 50000}',
   'net_income * 0.05', 1000, 15000, '{}',
   'High net income year — accelerate deductions to reduce current tax'),

  -- Defer Income
  ('defer-income', 'quickbooks', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 100000}',
   'net_income * 0.05', 2000, 20000, '{}',
   'High income year — deferring income to next year may save taxes'),

  -- Health Insurance Deduction for self-employed
  ('health-insurance-deduction', 'quickbooks', 'expenses',
   '{"field": "health_insurance_premiums", "op": "gt", "value": 0}',
   'health_insurance_premiums * 0.30', 500, 8000, '{}',
   'Self-employed health insurance premiums are deductible above the line'),

  -- Hobby Loss avoidance
  ('hobby-loss-rules', 'quickbooks', 'pnl',
   '{"and": [{"field": "net_income", "op": "lt", "value": 0}, {"field": "consecutive_loss_years", "op": "gte", "value": 2}]}',
   'fixed:2000', 500, 5000, '{}',
   'Consecutive loss years detected — document business intent to avoid hobby classification'),

  -- SALT Workaround
  ('state-salt-workaround', 'quickbooks', 'pnl',
   '{"and": [{"field": "net_income", "op": "gt", "value": 50000}, {"field": "state_tax_paid", "op": "gt", "value": 10000}]}',
   'state_tax_paid * 0.15', 1500, 20000, '{}',
   'High state tax + business income — PTE election may bypass SALT cap'),

  -- ── Gusto / Payroll ───────────────────────────────────────

  -- S-Corp Election
  ('s-corp-election', 'gusto', 'payroll',
   '{"field": "owner_total_comp", "op": "gt", "value": 60000}',
   'owner_total_comp * 0.153 * 0.40', 3000, 30000, '{}',
   'Owner compensation high enough for S-Corp SE tax savings'),

  -- Reasonable Salary optimization
  ('reasonable-salary', 'gusto', 'payroll',
   '{"and": [{"field": "is_scorp", "op": "eq", "value": true}, {"field": "owner_salary", "op": "gt", "value": 0}]}',
   'owner_total_comp * 0.05', 1000, 15000, '{}',
   'S-Corp detected — optimizing reasonable salary saves SE tax'),

  -- Family Employment
  ('family-employment', 'gusto', 'payroll',
   '{"field": "employee_count", "op": "gte", "value": 1}',
   'fixed:5000', 1000, 12000, '{}',
   'Business with employees — employing family members shifts income to lower brackets'),

  -- R&D Credit against Payroll Tax (startup)
  ('r-and-d-startup-offset', 'gusto', 'payroll',
   '{"and": [{"field": "total_payroll_tax", "op": "gt", "value": 5000}, {"field": "is_startup", "op": "eq", "value": true}]}',
   'total_payroll_tax * 0.30', 2000, 250000, '{}',
   'Startup with payroll taxes can offset R&D credit against FICA'),

  -- Retirement Plan Credit
  ('retirement-plan-credit', 'gusto', 'payroll',
   '{"field": "has_retirement_plan", "op": "eq", "value": false}',
   'fixed:5000', 1500, 5000, '{}',
   'No retirement plan detected — starting one earns a 3-year tax credit'),

  -- Defined Benefit Plan
  ('defined-benefit-plan', 'gusto', 'payroll',
   '{"and": [{"field": "owner_total_comp", "op": "gt", "value": 200000}, {"field": "owner_age", "op": "gte", "value": 40}]}',
   'fixed:50000', 10000, 265000, '{}',
   'High-income owner 40+ can shelter large amounts via defined benefit plan'),

  -- ── GitHub / R&D Evidence ──────────────────────────────────

  -- R&D Tax Credit from commit activity
  ('r-and-d-credit', 'github', 'commits',
   '{"field": "total_commits_12m", "op": "gt", "value": 100}',
   'estimated_rd_spend * 0.065', 5000, 250000, '{"payroll"}',
   'Significant engineering activity supports R&D credit claim'),

  -- R&D from PR activity
  ('r-and-d-credit', 'github', 'pull_requests',
   '{"field": "total_prs_12m", "op": "gt", "value": 20}',
   'estimated_rd_spend * 0.065', 5000, 250000, '{}',
   'Pull request activity provides contemporaneous R&D documentation'),

  -- ── Jira / R&D Evidence ────────────────────────────────────

  ('r-and-d-credit', 'jira', 'sprints',
   '{"field": "engineering_hours_12m", "op": "gt", "value": 500}',
   'engineering_hours_12m * 75 * 0.065', 5000, 250000, '{}',
   'Sprint data shows engineering hours that qualify for R&D credit'),

  -- ── Stripe / Revenue ───────────────────────────────────────

  ('qbi-deduction', 'stripe', 'revenue',
   '{"field": "net_revenue", "op": "gt", "value": 10000}',
   'net_revenue * 0.20', 2000, 50000, '{}',
   'Stripe revenue qualifies as QBI for 20% deduction'),

  ('estimated-tax-planning', 'stripe', 'revenue',
   '{"field": "net_revenue", "op": "gt", "value": 20000}',
   'fixed:3000', 500, 5000, '{}',
   'Significant Stripe revenue — ensure quarterly estimated payments'),

  -- ── MileIQ / Everlance ─────────────────────────────────────

  ('vehicle-deduction', 'mileiq', 'mileage',
   '{"field": "business_miles", "op": "gt", "value": 500}',
   'business_miles * 0.67', 335, 15000, '{}',
   'Business mileage tracked — standard mileage deduction at IRS rate'),

  ('vehicle-deduction', 'everlance', 'mileage',
   '{"field": "business_miles", "op": "gt", "value": 500}',
   'business_miles * 0.67', 335, 15000, '{}',
   'Business mileage tracked — standard mileage deduction at IRS rate'),

  -- ── Zillow / Redfin / Property ─────────────────────────────

  ('cost-segregation', 'zillow', 'property',
   '{"field": "property_value", "op": "gt", "value": 500000}',
   'property_value * 0.05', 5000, 100000, '{}',
   'High-value property detected — cost segregation accelerates depreciation'),

  ('cost-segregation', 'redfin', 'property',
   '{"field": "property_value", "op": "gt", "value": 500000}',
   'property_value * 0.05', 5000, 100000, '{}',
   'High-value property detected — cost segregation accelerates depreciation'),

  ('home-office-deduction', 'zillow', 'property',
   '{"field": "is_primary_residence", "op": "eq", "value": true}',
   'fixed:1500', 500, 1500, '{}',
   'Primary residence detected — simplified home office deduction applies'),

  -- Short-Term Rental
  ('short-term-rental', 'zillow', 'property',
   '{"and": [{"field": "property_count", "op": "gte", "value": 2}, {"field": "avg_rental_days", "op": "lte", "value": 7}]}',
   'property_value * 0.03', 3000, 50000, '{}',
   'Short-term rental with avg stay <= 7 days may qualify for material participation loophole'),

  -- 1031 Exchange
  ('1031-exchange', 'zillow', 'property',
   '{"and": [{"field": "property_count", "op": "gte", "value": 2}, {"field": "total_appreciation", "op": "gt", "value": 50000}]}',
   'total_appreciation * 0.25', 5000, 200000, '{}',
   'Multiple properties with appreciation — 1031 exchange defers capital gains'),

  -- Real Estate Professional Status
  ('real-estate-pro', 'zillow', 'property',
   '{"and": [{"field": "property_count", "op": "gte", "value": 3}, {"field": "rental_income", "op": "gt", "value": 20000}]}',
   'rental_income * 0.25', 5000, 50000, '{}',
   'Multiple rental properties — REPS unlocks unlimited loss deductions'),

  -- Rental Loss Allowance
  ('rental-loss-allowance', 'zillow', 'property',
   '{"and": [{"field": "rental_loss", "op": "lt", "value": 0}, {"field": "estimated_income", "op": "lt", "value": 150000}]}',
   'fixed:7500', 2000, 25000, '{}',
   'Rental losses with income under $150k qualify for $25k special allowance'),

  -- Opportunity Zone
  ('opportunity-zone', 'zillow', 'property',
   '{"field": "in_opportunity_zone", "op": "eq", "value": true}',
   'property_value * 0.10', 5000, 100000, '{}',
   'Property in Qualified Opportunity Zone — gains deferral and exclusion'),

  -- ── CoStar / Commercial Property ───────────────────────────

  ('cost-segregation', 'costar', 'commercial_property',
   '{"field": "property_value", "op": "gt", "value": 500000}',
   'property_value * 0.08', 10000, 200000, '{}',
   'Commercial property qualifies for aggressive cost segregation'),

  -- ── Stride Health / Healthcare.gov ─────────────────────────

  ('health-insurance-deduction', 'stride-health', 'insurance',
   '{"field": "annual_premium", "op": "gt", "value": 0}',
   'annual_premium * 0.30', 500, 8000, '{}',
   'Health insurance premiums for self-employed are deductible'),

  ('health-insurance-deduction', 'healthcare-gov', 'insurance',
   '{"field": "annual_premium", "op": "gt", "value": 0}',
   'annual_premium * 0.30', 500, 8000, '{}',
   'Marketplace health insurance premiums are deductible for self-employed'),

  -- ── Expensify ──────────────────────────────────────────────

  ('vehicle-deduction', 'expensify', 'expenses',
   '{"field": "mileage_expenses", "op": "gt", "value": 500}',
   'mileage_expenses * 0.40', 200, 10000, '{}',
   'Mileage expenses in Expensify support vehicle deduction'),

  ('home-office-deduction', 'expensify', 'expenses',
   '{"field": "home_office_expenses", "op": "gt", "value": 0}',
   'home_office_expenses * 0.30', 200, 1500, '{}',
   'Home office expenses tracked in Expensify'),

  -- ── Gmail / Documents ──────────────────────────────────────

  ('charitable-bunching', 'gmail', 'receipts',
   '{"field": "donation_receipt_count", "op": "gt", "value": 3}',
   'fixed:2000', 500, 10000, '{}',
   'Multiple donation receipts found — bunching strategy applicable'),

  -- ── Collective / S-Corp ────────────────────────────────────

  ('s-corp-election', 'collective', 'entity',
   '{"field": "entity_type", "op": "eq", "value": "llc"}',
   'estimated_se_income * 0.153 * 0.40', 3000, 30000, '{}',
   'LLC detected — S-Corp election can reduce self-employment tax'),

  ('reasonable-salary', 'collective', 'entity',
   '{"field": "entity_type", "op": "eq", "value": "s-corp"}',
   'owner_distributions * 0.05', 1000, 15000, '{}',
   'S-Corp entity — salary optimization reduces SE tax'),

  -- ── Xero / Accounting ──────────────────────────────────────

  ('qbi-deduction', 'xero', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 10000}',
   'net_income * 0.20', 2000, 50000, '{}',
   'Xero P&L shows qualified business income for QBI deduction'),

  ('accelerate-deductions', 'xero', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 50000}',
   'net_income * 0.05', 1000, 15000, '{}',
   'High net income in Xero — accelerate deductions to reduce current tax'),

  ('section-179', 'xero', 'expenses',
   '{"field": "equipment_purchases", "op": "gt", "value": 2000}',
   'equipment_purchases * 0.30', 600, 50000, '{}',
   'Equipment purchases in Xero qualify for Section 179'),

  -- ── FreshBooks ─────────────────────────────────────────────

  ('qbi-deduction', 'freshbooks', 'pnl',
   '{"field": "net_income", "op": "gt", "value": 10000}',
   'net_income * 0.20', 2000, 50000, '{}',
   'FreshBooks income qualifies for QBI deduction'),

  ('home-office-deduction', 'freshbooks', 'expenses',
   '{"field": "home_office_expenses", "op": "gt", "value": 0}',
   'home_office_expenses * 0.30', 200, 1500, '{}',
   'Home office expenses found in FreshBooks'),

  -- ── ADP / Payroll ──────────────────────────────────────────

  ('s-corp-election', 'adp', 'payroll',
   '{"field": "owner_total_comp", "op": "gt", "value": 60000}',
   'owner_total_comp * 0.153 * 0.40', 3000, 30000, '{}',
   'ADP payroll shows high owner comp — S-Corp election saves SE tax'),

  ('family-employment', 'adp', 'payroll',
   '{"field": "employee_count", "op": "gte", "value": 1}',
   'fixed:5000', 1000, 12000, '{}',
   'ADP payroll with employees — family employment shifts income'),

  -- ── Paychex ────────────────────────────────────────────────

  ('s-corp-election', 'paychex', 'payroll',
   '{"field": "owner_total_comp", "op": "gt", "value": 60000}',
   'owner_total_comp * 0.153 * 0.40', 3000, 30000, '{}',
   'Paychex payroll data supports S-Corp election analysis'),

  -- ── Plaid: additional account-based strategies ─────────────

  -- EV Tax Credit: auto loan or auto-related account
  ('ev-tax-credit', 'plaid', 'transactions',
   '{"field": "ev_purchase_detected", "op": "eq", "value": true}',
   'fixed:7500', 3750, 7500, '{}',
   'Electric vehicle purchase detected in transactions'),

  -- Child Tax Credit: dependent-related transactions
  ('child-tax-credit', 'plaid', 'transactions',
   '{"field": "childcare_expenses", "op": "gt", "value": 1000}',
   'fixed:4000', 2000, 8000, '{}',
   'Childcare expenses detected — maximize child tax credit'),

  -- Dependent Care FSA
  ('dependent-care-fsa', 'plaid', 'transactions',
   '{"field": "childcare_expenses", "op": "gt", "value": 2000}',
   'fixed:1500', 750, 5000, '{}',
   'Childcare expenses support dependent care FSA enrollment'),

  -- Education Credits
  ('education-credits', 'plaid', 'transactions',
   '{"field": "education_expenses", "op": "gt", "value": 1000}',
   'fixed:2000', 500, 4000, '{}',
   'Education expenses detected — AOC or Lifetime Learning Credit may apply'),

  -- Withholding Optimization
  ('withholding-optimization', 'plaid', 'transactions',
   '{"field": "large_tax_refund", "op": "eq", "value": true}',
   'fixed:1000', 200, 3000, '{}',
   'Large tax refund detected — adjusting withholding improves cash flow'),

  -- Augusta Rule
  ('augusta-rule', 'plaid', 'transactions',
   '{"and": [{"field": "self_employment_income", "op": "gt", "value": 20000}, {"field": "has_primary_residence", "op": "eq", "value": true}]}',
   'fixed:5000', 2000, 10000, '{}',
   'Self-employed with home — Augusta Rule allows 14-day tax-free rental'),

  -- Mega Backdoor Roth
  ('mega-backdoor-roth', 'plaid', 'accounts',
   '{"and": [{"field": "has_401k", "op": "eq", "value": true}, {"field": "estimated_income", "op": "gt", "value": 200000}]}',
   'fixed:10000', 5000, 43500, '{}',
   '401(k) + high income — mega backdoor Roth allows additional after-tax contributions'),

  -- NUA Strategy
  ('nua-strategy', 'plaid', 'accounts',
   '{"and": [{"field": "has_401k", "op": "eq", "value": true}, {"field": "employer_stock_value", "op": "gt", "value": 50000}]}',
   'employer_stock_value * 0.15', 2000, 50000, '{}',
   'Employer stock in 401(k) — NUA strategy taxes appreciation at cap gains rate'),

  -- Energy Efficiency from transactions
  ('energy-efficiency', 'plaid', 'transactions',
   '{"field": "energy_improvement_expenses", "op": "gt", "value": 1000}',
   'energy_improvement_expenses * 0.30', 500, 3200, '{}',
   'Energy improvement expenses detected — up to 30% credit'),

  -- Defined Benefit Plan (from Plaid income)
  ('defined-benefit-plan', 'plaid', 'transactions',
   '{"and": [{"field": "self_employment_income", "op": "gt", "value": 200000}, {"field": "owner_age", "op": "gte", "value": 40}]}',
   'fixed:50000', 10000, 265000, '{}',
   'High self-employment income at 40+ — defined benefit plan shelters large amounts'),

  -- Gift Tax Exclusion
  ('gift-tax-exclusion', 'plaid', 'transactions',
   '{"field": "gift_transfers", "op": "gt", "value": 5000}',
   'fixed:2000', 500, 5000, '{}',
   'Large transfers detected — structured gifting reduces taxable estate')

on conflict do nothing;
