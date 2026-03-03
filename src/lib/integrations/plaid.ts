// ============================================================
// Plaid Client
// Wraps the Plaid Node SDK for link token creation,
// public token exchange, and data sync (accounts, transactions,
// holdings).
// ============================================================

import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} from "plaid";
import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken } from "@/lib/encryption";
import type { Database } from "@/lib/supabase/types";

type IntegrationTokenRow = Database["public"]["Tables"]["integration_tokens"]["Row"];

// ---- Singleton client ----

let _client: PlaidApi | null = null;

function getPlaidClient(): PlaidApi {
  if (_client) return _client;

  const config = new Configuration({
    basePath:
      PlaidEnvironments[
        (process.env.PLAID_ENV as keyof typeof PlaidEnvironments) ?? "sandbox"
      ],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
        "PLAID-SECRET": process.env.PLAID_SECRET!,
      },
    },
  });

  _client = new PlaidApi(config);
  return _client;
}

// ---- Link Token ----

/**
 * Create a Plaid Link token for the given user.
 * The token is used to initialize Plaid Link on the client side.
 */
export async function createLinkToken(
  userId: string,
  products: Products[] = [Products.Transactions],
): Promise<string> {
  const client = getPlaidClient();

  const response = await client.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "RoboTax",
    products,
    country_codes: [CountryCode.Us],
    language: "en",
  });

  return response.data.link_token;
}

// ---- Token Exchange ----

/**
 * Exchange a public_token from Plaid Link for a permanent access_token.
 * Returns { accessToken, itemId }.
 */
export async function exchangePublicToken(publicToken: string): Promise<{
  accessToken: string;
  itemId: string;
}> {
  const client = getPlaidClient();
  const response = await client.itemPublicTokenExchange({
    public_token: publicToken,
  });

  return {
    accessToken: response.data.access_token,
    itemId: response.data.item_id,
  };
}

// ---- Data Sync ----

/**
 * Fetch all accounts for a Plaid item and store in integration_data.
 */
export async function syncAccounts(
  userId: string,
  accessToken: string
): Promise<void> {
  const client = getPlaidClient();
  const admin = createAdminClient();

  const response = await client.accountsGet({ access_token: accessToken });
  const accounts = response.data.accounts;

  // Classify accounts
  const has401k = accounts.some(
    (a) => a.subtype === "401k" || a.name?.toLowerCase().includes("401k")
  );
  const hasIra = accounts.some(
    (a) => a.subtype === "ira" || a.subtype === "roth" || a.name?.toLowerCase().includes("ira")
  );
  const hasHsa = accounts.some(
    (a) => a.subtype === "hsa" || a.name?.toLowerCase().includes("hsa")
  );
  const totalBalance = accounts.reduce(
    (sum, a) => sum + (a.balances.current ?? 0),
    0
  );
  const traditionalIraBalance = accounts
    .filter((a) => a.subtype === "ira")
    .reduce((sum, a) => sum + (a.balances.current ?? 0), 0);

  const data = {
    accounts: accounts.map((a) => ({
      id: a.account_id,
      name: a.name,
      type: a.type,
      subtype: a.subtype,
      balance: a.balances.current,
      currency: a.balances.iso_currency_code,
    })),
    account_count: accounts.length,
    total_balance: totalBalance,
    has_401k: has401k,
    has_ira: hasIra,
    has_hsa_account: hasHsa,
    traditional_ira_balance: traditionalIraBalance,
  };

  await admin.from("integration_data").upsert(
    {
      user_id: userId,
      provider: "plaid",
      data_type: "accounts",
      data: data as unknown as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      is_stale: false,
    },
    { onConflict: "user_id,provider,data_type" }
  );
}

/**
 * Incrementally sync transactions using Plaid's cursor-based sync.
 */
export async function syncTransactions(
  userId: string,
  accessToken: string
): Promise<void> {
  const client = getPlaidClient();
  const admin = createAdminClient();

  // Get existing cursor
  const { data: existing } = await admin
    .from("integration_data")
    .select("sync_cursor")
    .eq("user_id", userId)
    .eq("provider", "plaid")
    .eq("data_type", "transactions")
    .single();

  let cursor = existing?.sync_cursor ?? undefined;
  let allAdded: Array<Record<string, unknown>> = [];
  let hasMore = true;

  while (hasMore) {
    const response = await client.transactionsSync({
      access_token: accessToken,
      cursor: cursor || undefined,
    });

    const { added, has_more, next_cursor } = response.data;

    allAdded = allAdded.concat(
      added.map((t) => ({
        id: t.transaction_id,
        date: t.date,
        amount: t.amount,
        name: t.name,
        merchant: t.merchant_name,
        category: t.personal_finance_category?.primary,
        subcategory: t.personal_finance_category?.detailed,
      }))
    );

    cursor = next_cursor;
    hasMore = has_more;
  }

  // Analyze transactions for strategy engine fields
  const selfEmploymentIncome = allAdded
    .filter(
      (t) =>
        (t.category as string)?.includes("INCOME") &&
        (t.amount as number) < 0 // Plaid: income is negative
    )
    .reduce((sum, t) => sum + Math.abs(t.amount as number), 0);

  const charitableTotal = allAdded
    .filter((t) =>
      (t.category as string)?.includes("CHARITABLE") ||
      (t.subcategory as string)?.includes("CHARITABLE")
    )
    .reduce((sum, t) => sum + Math.abs(t.amount as number), 0);

  const childcareExpenses = allAdded
    .filter((t) =>
      (t.subcategory as string)?.includes("CHILDCARE") ||
      (t.category as string)?.includes("CHILDCARE")
    )
    .reduce((sum, t) => sum + Math.abs(t.amount as number), 0);

  const educationExpenses = allAdded
    .filter((t) =>
      (t.category as string)?.includes("EDUCATION")
    )
    .reduce((sum, t) => sum + Math.abs(t.amount as number), 0);

  const data = {
    transaction_count: allAdded.length,
    recent_transactions: allAdded.slice(0, 100),
    self_employment_income: selfEmploymentIncome,
    charitable_total: charitableTotal,
    childcare_expenses: childcareExpenses,
    education_expenses: educationExpenses,
  };

  await admin.from("integration_data").upsert(
    {
      user_id: userId,
      provider: "plaid",
      data_type: "transactions",
      data: data as unknown as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      sync_cursor: cursor,
      is_stale: false,
    },
    { onConflict: "user_id,provider,data_type" }
  );
}

/**
 * Sync investment holdings from Plaid.
 */
export async function syncHoldings(
  userId: string,
  accessToken: string
): Promise<void> {
  const client = getPlaidClient();
  const admin = createAdminClient();

  try {
    const response = await client.investmentsHoldingsGet({
      access_token: accessToken,
    });

    const { holdings, securities } = response.data;

    const securityMap = new Map(
      securities.map((s) => [s.security_id, s])
    );

    let totalUnrealizedLoss = 0;
    let totalGain = 0;
    let longTermGain = 0;
    let cryptoUnrealizedLoss = 0;

    const enriched = holdings.map((h) => {
      const sec = securityMap.get(h.security_id);
      const costBasis = h.cost_basis ?? 0;
      const marketValue = h.institution_value ?? 0;
      const gain = marketValue - costBasis;

      if (gain < 0) totalUnrealizedLoss += gain;
      if (gain > 0) totalGain += gain;
      // Approximate: if we don't know purchase date, assume long-term
      if (gain > 0) longTermGain += gain;
      if (sec?.type === "cryptocurrency" && gain < 0) {
        cryptoUnrealizedLoss += gain;
      }

      return {
        securityId: h.security_id,
        name: sec?.name,
        ticker: sec?.ticker_symbol,
        type: sec?.type,
        quantity: h.quantity,
        costBasis,
        marketValue,
        gain,
      };
    });

    const data = {
      holdings: enriched,
      holding_count: enriched.length,
      total_unrealized_loss: totalUnrealizedLoss,
      total_gain: totalGain,
      long_term_gain: longTermGain,
      crypto_unrealized_loss: cryptoUnrealizedLoss,
    };

    await admin.from("integration_data").upsert(
      {
        user_id: userId,
        provider: "plaid",
        data_type: "holdings",
        data: data as unknown as Record<string, unknown>,
        fetched_at: new Date().toISOString(),
        is_stale: false,
      },
      { onConflict: "user_id,provider,data_type" }
    );
  } catch {
    // Investment products not available for this item — skip silently
    console.log("[plaid] Holdings not available for this item, skipping");
  }
}

/**
 * Get the decrypted Plaid access token for a user.
 */
export async function getPlaidAccessToken(
  userId: string
): Promise<string | null> {
  const admin = createAdminClient();

  const { data: rawRow } = await admin
    .from("integration_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "plaid")
    .eq("status", "active")
    .single();

  const row = rawRow as IntegrationTokenRow | null;
  if (!row?.plaid_access_token_enc) return null;

  return decryptToken(row.plaid_access_token_enc);
}
