// ============================================================
// QuickBooks Online Client
// OAuth 2.0 flow, data fetching (P&L, expenses, balance sheet),
// and JSON file logging.
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import { decryptToken } from "@/lib/encryption";
import type { Database } from "@/lib/supabase/types";
import fs from "fs";
import path from "path";

type IntegrationTokenRow =
  Database["public"]["Tables"]["integration_tokens"]["Row"];

// ---- Constants ----

const QBO_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
const QBO_TOKEN_URL =
  "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const QBO_SCOPES = "com.intuit.quickbooks.accounting";

function getApiBase(): string {
  const env = process.env.QBO_ENV ?? "sandbox";
  return env === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";
}

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/api/integrations/quickbooks/callback`;
}

function logQboData(dataType: string, data: unknown) {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `qbo-${dataType}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[qbo] Logged ${dataType} data to ${filePath}`);
  } catch (err) {
    console.error(`[qbo] Failed to log ${dataType} data:`, err);
  }
}

// ---- OAuth ----

/**
 * Build the QuickBooks OAuth 2.0 authorization URL.
 * `state` should be a CSRF token stored in the user's session.
 */
export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.QBO_CLIENT_ID!,
    response_type: "code",
    scope: QBO_SCOPES,
    redirect_uri: getRedirectUri(),
    state,
  });
  return `${QBO_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 * Returns { accessToken, refreshToken, expiresIn, realmId }.
 */
export async function exchangeCode(
  code: string,
  realmId: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  realmId: string;
}> {
  const credentials = Buffer.from(
    `${process.env.QBO_CLIENT_ID}:${process.env.QBO_SECRET}`
  ).toString("base64");

  const res = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`QBO token exchange failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    realmId,
  };
}

/**
 * Refresh an expired access token using the refresh token.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const credentials = Buffer.from(
    `${process.env.QBO_CLIENT_ID}:${process.env.QBO_SECRET}`
  ).toString("base64");

  const res = await fetch(QBO_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`QBO token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

// ---- API Helpers ----

async function qboFetch(
  realmId: string,
  accessToken: string,
  endpoint: string
): Promise<unknown> {
  const base = getApiBase();
  const url = `${base}/v3/company/${realmId}/${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`QBO API error (${res.status}) ${endpoint}: ${text}`);
  }

  return res.json();
}

// ---- Data Sync ----

/**
 * Fetch Profit & Loss report and store in integration_data.
 */
export async function syncPnl(
  userId: string,
  realmId: string,
  accessToken: string
): Promise<void> {
  const admin = createAdminClient();

  const raw = await qboFetch(
    realmId,
    accessToken,
    "reports/ProfitAndLoss?date_macro=This Fiscal Year"
  );

  logQboData("pnl", raw);

  await admin.from("integration_data").upsert(
    {
      user_id: userId,
      provider: "quickbooks",
      data_type: "pnl",
      data: raw as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      is_stale: false,
    },
    { onConflict: "user_id,provider,data_type" }
  );
}

/**
 * Fetch expenses (Purchase entities) and store in integration_data.
 */
export async function syncExpenses(
  userId: string,
  realmId: string,
  accessToken: string
): Promise<void> {
  const admin = createAdminClient();

  const raw = await qboFetch(
    realmId,
    accessToken,
    "query?query=select * from Purchase MAXRESULTS 1000"
  );

  logQboData("expenses", raw);

  await admin.from("integration_data").upsert(
    {
      user_id: userId,
      provider: "quickbooks",
      data_type: "expenses",
      data: raw as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      is_stale: false,
    },
    { onConflict: "user_id,provider,data_type" }
  );
}

/**
 * Fetch Balance Sheet report and store in integration_data.
 */
export async function syncBalanceSheet(
  userId: string,
  realmId: string,
  accessToken: string
): Promise<void> {
  const admin = createAdminClient();

  const raw = await qboFetch(realmId, accessToken, "reports/BalanceSheet");

  logQboData("balance-sheet", raw);

  await admin.from("integration_data").upsert(
    {
      user_id: userId,
      provider: "quickbooks",
      data_type: "balance_sheet",
      data: raw as Record<string, unknown>,
      fetched_at: new Date().toISOString(),
      is_stale: false,
    },
    { onConflict: "user_id,provider,data_type" }
  );
}

// ---- Token Retrieval ----

/**
 * Get the decrypted QBO access token + realmId for a user.
 * Returns null if not found or expired.
 */
export async function getQboCredentials(
  userId: string
): Promise<{ accessToken: string; realmId: string } | null> {
  const admin = createAdminClient();

  const { data: rawRow } = await admin
    .from("integration_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "quickbooks")
    .eq("status", "active")
    .single();

  const row = rawRow as IntegrationTokenRow | null;
  if (!row?.access_token_enc || !row?.provider_user_id) return null;

  return {
    accessToken: decryptToken(row.access_token_enc),
    realmId: row.provider_user_id,
  };
}
