// ============================================================
// Provider Registry
// Central configuration for all integration providers.
// ============================================================

export type ProviderType = "plaid" | "oauth" | "api_key" | "native";

export interface ProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  /** Which power-up IDs map to this provider */
  powerUpIds: string[];
  /** Data types this provider can sync */
  dataTypes: string[];
  /** Whether this provider requires Plaid Link */
  requiresPlaidLink?: boolean;
}

/**
 * All known providers and the power-ups they back.
 * Financial institutions go through Plaid; others will get
 * OAuth / API key support in future phases.
 */
export const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  plaid: {
    id: "plaid",
    name: "Plaid",
    type: "plaid",
    powerUpIds: [
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
    ],
    dataTypes: ["accounts", "transactions", "holdings"],
    requiresPlaidLink: true,
  },
  quickbooks: {
    id: "quickbooks",
    name: "QuickBooks",
    type: "oauth",
    powerUpIds: ["quickbooks"],
    dataTypes: ["pnl", "expenses", "balance_sheet"],
  },
  xero: {
    id: "xero",
    name: "Xero",
    type: "oauth",
    powerUpIds: ["xero"],
    dataTypes: ["pnl", "expenses"],
  },
  freshbooks: {
    id: "freshbooks",
    name: "FreshBooks",
    type: "oauth",
    powerUpIds: ["freshbooks"],
    dataTypes: ["pnl", "expenses"],
  },
  gusto: {
    id: "gusto",
    name: "Gusto",
    type: "oauth",
    powerUpIds: ["gusto"],
    dataTypes: ["payroll"],
  },
  adp: {
    id: "adp",
    name: "ADP",
    type: "oauth",
    powerUpIds: ["adp"],
    dataTypes: ["payroll"],
  },
  paychex: {
    id: "paychex",
    name: "Paychex",
    type: "oauth",
    powerUpIds: ["paychex"],
    dataTypes: ["payroll"],
  },
  github: {
    id: "github",
    name: "GitHub",
    type: "oauth",
    powerUpIds: ["github"],
    dataTypes: ["commits", "pull_requests"],
  },
  jira: {
    id: "jira",
    name: "Jira",
    type: "oauth",
    powerUpIds: ["jira"],
    dataTypes: ["sprints"],
  },
  stripe: {
    id: "stripe",
    name: "Stripe",
    type: "oauth",
    powerUpIds: ["stripe"],
    dataTypes: ["revenue"],
  },
  gmail: {
    id: "gmail",
    name: "Gmail",
    type: "oauth",
    powerUpIds: ["gmail"],
    dataTypes: ["receipts"],
  },
};

/**
 * Look up the provider config for a given power-up ID.
 * Returns undefined if no provider backs this power-up.
 */
export function getProviderForPowerUp(
  powerUpId: string
): ProviderConfig | undefined {
  return Object.values(PROVIDER_CONFIG).find((p) =>
    p.powerUpIds.includes(powerUpId)
  );
}

/**
 * Does this power-up require the Plaid Link flow?
 */
export function requiresPlaidLink(powerUpId: string): boolean {
  const provider = getProviderForPowerUp(powerUpId);
  return provider?.requiresPlaidLink === true;
}
