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
