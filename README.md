# RoboTax

Tax savings discovery platform powered by 435+ strategies. Connect your financial data sources, and RoboTax identifies potential tax savings and connects you with a professional to implement them.

## User Story

1. **Sign Up** — User creates an account with email, phone number, and password
2. **Verify** — User confirms their email and phone number via 6-digit OTP codes
3. **Dashboard** — After login, a progress bar at the top starts at 0% and fills as data sources ("Power Ups") are connected
4. **Power Ups** — A step-by-step wizard guides the user through categories of data connectors (Financial, Accounting, Crypto, Real Estate, Payroll, R&D, Other). Each category shows a searchable grid of provider cards with logos and connect/disconnect buttons
5. **Calculate Savings** — A sticky button is always visible. When the user clicks it:
   - If < 30% of sources are connected, a warning encourages connecting more data sources first
   - If >= 30%, a loading screen runs the analysis, then shows estimated tax savings (conservative / base / aggressive ranges) with confidence scoring and top strategies identified
6. **Contact Professional** — The results screen prompts the user to contact a tax professional to implement the identified strategies

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | Mock JWT sessions (jose) |
| Icons | Lucide React |
| Logos | Simple Icons CDN |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@robotax.com` / `demo1234`

**New account verification code:** `123456` for both email and phone.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register, verify pages
│   ├── (protected)/      # Dashboard (auth-guarded)
│   ├── api/              # Mocked API routes
│   └── layout.tsx        # Root layout with Toaster + TooltipProvider
├── components/
│   ├── dashboard/        # Progress header, category stepper, power-up grid, savings dialog
│   ├── layout/           # Nav bar
│   └── ui/               # shadcn primitives
├── lib/
│   ├── mock-data/        # Users, power-ups, categories, savings calculation
│   ├── mock-auth.ts      # JWT session management
│   ├── types.ts          # Shared TypeScript interfaces
│   └── utils.ts          # cn() helper
└── proxy.ts              # Route protection (Next.js 16 proxy convention)
```
