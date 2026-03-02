

**RoboTax Product Roadmap**

V0 (SXSW Prototype)  ·  V1 (Production)  ·  V2 (Advanced Features)

March 1, 2026  |  Prepared for Aljo Development Meeting  |  CONFIDENTIAL

# **V0 — SXSW Prototype**

*Bare-minimum functional prototype for SXSW Innovation Conference · March 12–15, 2026 · 10 working days · \~80 dev hours*

Goal: Prove the intelligence loop — financial data enters the system, the matching engine identifies strategies from the 435-strategy database, estimated savings appear on screen.

## **V0 Feature List**

| \# | Feature | Description | Priority | Hours |
| :---- | :---- | :---- | :---- | :---- |
| **1** | Tax Strategies Database | 435 strategies loaded, browseable, searchable. PostgreSQL \+ full-text search \+ GIN indexes. Filterable by category, entity type, income range, risk level | P0 | 12 |
| **2** | Tax Return Ingestor (Mocked) | Drag-and-drop upload UI. Pre-parsed JSON responses from cache. Real OCR (Sensible.so) deferred to V1 | P0 | 6 |
| **3** | Power Ups Onboarding | 7 intelligence modules — toggle to connect data sources. Progress bar. Each connection unlocks new platform capabilities | P1 | 8 |
| **4** | Security | Built into stack: TLS 1.2+, AES-256, Supabase Auth \+ MFA, Row-Level Security. Synthetic data only — no PII | P0 | 0 |
| **5** | Tax Savings Calculator | Inputs: entity type, revenue, industry, payroll, R\&D spend, prior tax. Outputs: conservative/base/aggressive ranges with confidence scoring. Top 50 strategy formulas | P0 | 10 |
| **6** | Professional Login \+ CPA Dashboard | Client roster, total savings hero metric, 65/35 revenue tracker, strategy queue, compliance gate, RBAC | P0 | 16 |
| **7** | Client Login \+ Dashboard | Plain-English savings, strategy cards with status, Power Ups sidebar, document upload, advisor contact | P1 | 12 |
| **8** | Strategy Matching Engine | Rule-based matching on top 50 strategies. Animated demo mode — "Run Analysis" button shows strategies populating in real-time. CPA review gate required | P0 | 12 |
| **9** | IRC §7216 Consent Modal | 4-tier consent architecture. Fires BEFORE every data connection. Legal-grade disclosure with form fields | P0 | 4 |
| **10** | Email Notifications (UI only) | Template display for client invites, account connected, analysis complete, strategy ready. No actual sending | P2 | 4 |
| **11** | CPA ROI Calculator | Interactive calculator: input client count \+ average engagement → calculates revenue with 65/35 split | P1 | 4 |
| **12** | SXSW Lead Capture \+ QR Code | Email capture landing page with QR code for booth materials | P0 | 2 |

**Total: \~90 hours · Scope cut recommendation:** Drop email notifications and Before/After comparison. Focus on strategies → matching → savings → dashboards.

## **V0 Tech Stack**

| Layer | Tool | Why |
| :---- | :---- | :---- |
| **Frontend** | Next.js 16 \+ shadcn/ui \+ Tailwind CSS v4 | Largest ecosystem, best AI code gen support |
| **Backend** | Supabase (PostgreSQL \+ Auth \+ Edge Functions) | Auto-generated APIs, built-in auth, RLS, $25/mo |
| **Auth** | Supabase Auth → Clerk (V1) | Free for prototype; Clerk adds Organizations for V1 |
| **Hosting** | Vercel (frontend) \+ Supabase (backend) | Auto-deploy from GitHub, SOC 2 certified, free tier |
| **Rule Engine** | Custom if/else → json-rules-engine (V1) | Top 50 rules for prototype; JSON-stored rules for V1 |

## **V0 Timeline**

| Day | Task | Hours |
| :---- | :---- | :---- |
| **1** | Project setup \+ deploy pipeline | 6 |
| **1–2** | Database schema \+ seed 435 strategies ⚡ BLOCKS EVERYTHING | 10 |
| **3** | Auth \+ RBAC \+ consent modal | 8 |
| **4** | Strategy browser \+ search \+ detail views | 8 |
| **5–6** | CPA dashboard \+ client management \+ revenue tracker | 16 |
| **7–8** | Strategy matching engine \+ savings calculator | 22 |
| **9–10** | Client portal \+ Power Ups \+ Plaid sandbox | 12 |
| **10–11** | Polish, demo flow, synthetic data, QR code | 10 |

# **Complete Integration & Data Source List**

Every external service, API, and data source the platform connects to.

## **Financial Account Linking (via Plaid)**

| Category | Institutions / Services | Data Retrieved |
| :---- | :---- | :---- |
| **Major Banks** | Chase, Bank of America, Wells Fargo, Citibank, US Bank, PNC, TD Bank, Capital One, Truist, Regions, M\&T, Huntington, KeyBank | Account balances, transactions, cash flow, income verification |
| **Investment Brokerages** | Fidelity, Charles Schwab, Vanguard, E\*TRADE, Merrill Lynch, TD Ameritrade, Interactive Brokers, Robinhood | Holdings, transactions, cost basis, dividends, capital gains/losses |
| **Private Banking / HNW** | Goldman Sachs (Marcus), J.P. Morgan Private Bank, Morgan Stanley Wealth, UBS, Northern Trust, State Street, BNY Mellon, Raymond James | Portfolio positions, alternative investments, trust accounts |
| **Business Banking** | Mercury, Brex, Relay, Bluevine, Novo, Lili, Found | Business checking, expense categorization, revenue tracking |
| **Credit Cards** | Amex, Discover, all major issuers via Plaid | Business expenses, category classification for deductions |
| **Crypto Exchanges (V2)** | Coinbase, Kraken, Gemini, Binance.US | Holdings, transaction history for loss harvesting |

*Plaid covers 12,000+ financial institutions via a single integration.*

## **Accounting Software**

| Platform | API Status | Data Retrieved | Phase |
| :---- | :---- | :---- | :---- |
| **QuickBooks Online** | Public API, free, mature | P\&L, balance sheet, chart of accounts, vendors, invoices, payroll summary | V0 (mock) / V1 (live) |
| **Xero** | Public API, free | Same as QBO — international firms | V1 |
| **FreshBooks** | Public API | Invoices, expenses, time tracking | V1 |
| **Wave** | Limited API | Basic financials | V2 |
| **Sage** | Partner API | Enterprise accounting data | V2 |

## **Payroll Systems**

| Platform | Data Retrieved | Phase |
| :---- | :---- | :---- |
| **ADP (Marketplace API)** | W-2 data, employee count, wages, FICA withholding, tip data, contractor payments | V1 |
| **Gusto (Partner API)** | Payroll runs, employee classifications, benefits, contractor 1099 data | V1 |
| **Paychex** | Payroll summaries, tax deposits | V1 |
| **Rippling** | Payroll \+ HR data, employee lifecycle | V2 |
| **OnPay** | Small business payroll | V2 |

## **Tax Return Parsing**

| Tool | What It Does | Forms Supported | Phase |
| :---- | :---- | :---- | :---- |
| **Sensible.so** | AI-powered document extraction. Pre-built 1040 parser. SOC 2 Type II. $0.50–$2/doc | 1040, 1120, 1120-S, 1065, W-2, 1099, K-1 | V1 |
| **Manual Upload (mocked)** | Drag-and-drop UI with cached JSON responses | Any PDF | V0 |

**Critical finding:** Intuit ProConnect/Lacerte, Thomson Reuters UltraTax, and Drake have NO public APIs. OCR-based parsing via Sensible.so is the only viable cross-platform approach.

## **Email & Document Sources**

| Platform | Data Retrieved | Phase |
| :---- | :---- | :---- |
| **Gmail (Google API)** | Receipt scanning, R\&D activity evidence, vendor communications | V1 |
| **Outlook/Microsoft 365** | Same as Gmail — enterprise clients | V1 |
| **Google Drive** | Tax documents, financial statements, uploaded returns | V1 |
| **Dropbox** | Document storage integration | V2 |
| **Box** | Enterprise document management | V2 |

## **Project Management / R\&D Evidence**

| Platform | Data Retrieved | Why | Phase |
| :---- | :---- | :---- | :---- |
| **Jira** | Sprint data, story points, engineering hours | R\&D credit 4-part test documentation | V1 |
| **GitHub / GitLab** | Commit history, PRs, code review activity | R\&D qualifying activity evidence | V1 |
| **Asana / Monday.com** | Task tracking, project timelines | Supporting R\&D documentation | V2 |
| **Slack** | Channel activity, R\&D discussion evidence | Contemporaneous documentation | V2 |

## **Property & Real Estate Data**

| Source | Data Retrieved | Phase |
| :---- | :---- | :---- |
| **County assessor records (API aggregators)** | Property values, purchase dates, classifications | V1 |
| **Zillow/Redfin APIs** | Fair market value estimates for Augusta Rule | V1 |
| **CoStar (commercial)** | Commercial property data for cost segregation | V2 |

## **Supply Chain / Tariff Data**

| Source | Data Retrieved | Phase |
| :---- | :---- | :---- |
| **CBP entry summaries** | Import records, HTSUS codes, duties paid | V1 |
| **QuickBooks (import expenses)** | Vendor payments flagged as international | V1 |
| **Supply chain ledgers** | Direct tariff payment identification | V1 |

## **CRM & Sales Tools**

| Platform | Integration Purpose | Phase |
| :---- | :---- | :---- |
| **HubSpot** | CPA firm pipeline tracking, partner onboarding | V1 |
| **Salesforce** | Enterprise CPA firm CRM integration | V2 |
| **Calendly** | Meeting scheduling for CPA-client workflows | V1 |

## **Compliance & Tax Research**

| Platform | Purpose | Phase |
| :---- | :---- | :---- |
| **CCH Axcess (API)** | Direct integration with Thomson Reuters tax prep | V1 ($5K–$25K/yr license) |
| **IRS e-Services** | Transcript retrieval, filing status | V1 |
| **Bloomberg Tax** | Authority citation verification | V2 |

## **Payment & Billing**

| Platform | Purpose | Phase |
| :---- | :---- | :---- |
| **Stripe Billing** | SaaS subscriptions, TAM fee collection, 65/35 revenue split via Connect | V1 |
| **Stripe Connect** | Automatic partner payout splitting | V1 |

## **Notification & Communication**

| Platform | Purpose | Phase |
| :---- | :---- | :---- |
| **SendGrid / Postmark** | Transactional email (invites, alerts, status updates) | V1 |
| **Twilio (SMS)** | Critical compliance alerts, two-factor auth | V2 |
| **In-app notifications** | Real-time strategy matches, document requests, compliance alerts | V1 |

# **V1 — Production Platform**

*Post-SXSW full-featured core · Target: September 2026 · All features built in-house*

V1 is focused on one thing: collect the most data, the fastest, from the most qualified users. Every feature serves that goal.

## **V1 Feature List**

| \# | Feature | Description | Priority |
| :---- | :---- | :---- | :---- |
| **1** | Full Strategy Database | 435 strategies with search, filters, IRC authority citations, risk classification | P0 |
| **2** | CPA Firm Onboarding | Signup → configure → import clients → first match in \<48 hours | P0 |
| **3** | AI Strategy Engine | Claude API \+ RAG against 435-strategy knowledge base. JSON rules in PostgreSQL. Sub-second matching | P0 |
| **4** | Tax Return Ingestion | Sensible.so API for 1040, 1120, 1120-S, 1065\. $0.50–$2/doc | P0 |
| **5** | Plaid Account Linking (Production) | Full OAuth with 12,000+ institutions. Power Ups UX for engagement | P0 |
| **6** | CPA Dashboard | Client roster, savings tracking, strategy queue, revenue share tracker, compliance status | P0 |
| **7** | Client Portal | Savings view, strategy cards, document uploads, secure messaging, advisor contact | P0 |
| **8** | Savings Calculator | Full 435-strategy calculation engine with ranges and confidence scoring | P0 |
| **9** | Billing (Stripe) | TAM fee ($2,500/mo), implementation fee ($100K min), 65/35 auto-split via Connect | P0 |
| **10** | 4-Tier Data Consent | IRC §7216, CCPA, GLBA. Separate consent records per tier. Self-service withdrawal | P0 |
| **11** | Audit Risk Scoring | 5-tier risk engine. Listed Transaction firewall. Per-strategy risk classification | P1 |
| **12** | AuditArmor Documentation | Auto-generated tax position memos, authority citation chains, audit defense packages | P1 |
| **13** | Notifications | Email (SendGrid) \+ in-app. Deadlines, new matches, document requests, compliance alerts | P1 |
| **14** | QuickBooks Integration | Direct API for P\&L, balance sheet, chart of accounts | P1 |
| **15** | Retroactive Filing | R\&D credits, amended returns, 3-year lookback identification | P1 |
| **16** | Partner Portal | White-label, revenue attribution, referral tracking, commission calculator | P1 |
| **17** | Analytics Dashboard | Firm-level and platform-level reporting | P1 |
| **18** | SOC 2 Type I | Via Vanta or Drata. Required before enterprise sales | P1 |
| **19** | Admin Panel | Strategy CRUD, user management, platform operations | P2 |
| **20** | CCH Axcess Integration | Direct integration with Thomson Reuters tax prep | P2 |
| **21** | Xero Integration | International accounting software support | P2 |
| **22** | Public API | Third-party integration layer | P2 |

## **V1 Build Sequence**

| Phase | What Gets Built | When |
| :---- | :---- | :---- |
| **1: Core Platform** | Auth, RBAC, strategy database, matching engine, CPA dashboard, client portal | Apr–May |
| **2: Data Ingestion** | Sensible.so, Plaid production, QBO API, savings calculator | May–Jun |
| **3: Compliance \+ Billing** | AuditArmor, Stripe, firm onboarding, 4-tier consent | Jun–Jul |
| **4: Security \+ Polish** | Notifications, reporting, SOC 2 prep, pen testing | Jul–Aug |
| **5: Beta \+ Launch** | Beta with 5–10 CPA firms → iterate → launch | Sep |

# **V2 — Advanced Features & Roadmap**

*Data monetization infrastructure · Advanced AI · Enterprise capabilities*

| \# | Feature | What It Does | Complexity |
| :---- | :---- | :---- | :---- |
| **1** | Agentic AI Tax Assistant | Autonomous AI drafts IRS notice responses based on client history | High |
| **2** | Predictive Cash Flow | AI forecasts future tax liabilities from real-time banking data | Medium |
| **3** | Advanced Cost Segregation | Instant accelerated depreciation simulation from property data APIs | High |
| **4** | Entity Structuring Engine | Simulates exact tax outcomes of LLC → S-Corp/C-Corp conversions | High |
| **5** | Data Monetization API | Authenticated, rate-limited API for licensed data buyers | High |
| **6** | Anonymization Pipeline | k-anonymity \+ differential privacy ETL for Tier 3/4 consent data | High |
| **7** | Crypto Asset Ingestion | Exchange API hooks for automated loss harvesting | Medium |
| **8** | Wealth Transfer Simulator | Estate tax modeling and trust simulation for HNW clients | High |
| **9** | Automated 1099 Generation | Detects contractor payments and automates filing | Low |
| **10** | International (UK/Canada) | Adapt engine for HMRC and CRA tax codes | High |
| **11** | White-Label Mobile App | Custom-branded iOS/Android for enterprise CPA partners | Medium |
| **12** | Benchmarking Insights | Compare client tax efficiency vs. anonymized peers | Medium |
| **13** | Audit Defense Vault | Immutable time-stamped storage for strategy documentation | Low |
| **14** | Dynamic Policy Updater | Auto-adjusts 435 strategies based on daily legislative changes | High |
| **15** | Refund Anticipation Loans | Lender integration to instantly underwrite tariff/R\&D refunds | Medium |
| **16** | Azure Gov Cloud | FedRAMP High \+ DoD IL5 for defense/government vertical | High |

## **Tariff Refund Module (V1/V2)**

$150–180B in IEEPA tariffs potentially refund-eligible following the February 2026 Supreme Court ruling.

* **Identification:** AI scans supply chain ledgers and CBP entry summaries  
* **Matching:** Cross-references HTSUS codes against nullified IEEPA schedules  
* **Documentation:** Post-Summary Corrections (unliquidated) \+ Form 19 Protests (liquidated)  
* **Revenue:** Analysis fee: $2,500–$5,000. Implementation fee: $25K–$100K

## **DeepInvent R\&D Credit Synergy**

* **Flow:** DeepInvent sells to R\&D-intensive company → RoboTax identifies R\&D credit eligibility  
* **Bonus:** DeepInvent license ($100K) IS an R\&D expense counting toward credit calculation  
* **Evidence:** DeepInvent audits email/Jira/GitHub for R\&D activities \= contemporaneous IRS documentation  
* **Pipeline:** \~60+ pre-qualified R\&D credit leads per year from DeepInvent pipeline

*RoboTax  |  Confidential  |  March 2026*