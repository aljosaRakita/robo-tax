// ============================================================
// Demo Mode — Meridian Manufacturing 60-second demo
// ============================================================

export const DEMO_USER_EMAIL = "demo@robotax.com";
export const DEMO_USER_ID = process.env.DEMO_USER_ID || "b3d0ad2b-f8ae-4468-a13f-a014bb7455ff";

/** Check if the given email or user ID belongs to the demo account */
export function isDemoUser(emailOrId: string | null | undefined): boolean {
  if (!emailOrId) return false;
  return emailOrId === DEMO_USER_EMAIL || (!!DEMO_USER_ID && emailOrId === DEMO_USER_ID);
}

/** All Plaid-backed power-up IDs that get bulk-connected during the demo */
export const PLAID_POWER_UP_IDS = [
  "plaid",
  "chase",
  "boa",
  "wells-fargo",
  "fidelity",
  "robinhood",
  "capital-one",
  "coinbase",
  "kraken",
  "gemini",
  "binance-us",
  "vanguard",
  "schwab",
] as const;

/** Ordered demo targets — one per category */
export const DEMO_TARGETS: Record<string, string> = {
  financial: "plaid",
  accounting: "quickbooks",
  payroll: "gusto",
  "r-and-d": "github",
  property: "zillow",
  documents: "gmail",
};
