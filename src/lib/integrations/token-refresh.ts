// ============================================================
// Token Refresh
// Handles token expiry checks and refresh for OAuth providers.
// Currently a placeholder for Phase 4+ OAuth providers.
// Plaid tokens don't expire, so this is primarily for future use.
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import { encryptToken, decryptToken } from "@/lib/encryption";
import type { Database } from "@/lib/supabase/types";

type IntegrationTokenRow = Database["public"]["Tables"]["integration_tokens"]["Row"];
type IntegrationTokenInsert = Database["public"]["Tables"]["integration_tokens"]["Insert"];

/**
 * Check if a token is expired or about to expire (within 5 min buffer).
 */
export function isTokenExpired(row: IntegrationTokenRow): boolean {
  if (!row.token_expires_at) return false; // no expiry = doesn't expire (e.g. Plaid)
  const expiresAt = new Date(row.token_expires_at).getTime();
  const buffer = 5 * 60 * 1000; // 5 minutes
  return Date.now() >= expiresAt - buffer;
}

/**
 * Get a valid access token for a user+provider.
 * If the token is expired and a refresh_token exists, attempts refresh.
 * Returns the decrypted access token or null if unavailable.
 */
export async function getValidAccessToken(
  userId: string,
  provider: string
): Promise<string | null> {
  const admin = createAdminClient();

  const { data: rawRow } = await admin
    .from("integration_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", provider)
    .eq("status", "active")
    .single();

  const row = rawRow as IntegrationTokenRow | null;
  if (!row) return null;

  // Plaid tokens: use plaid_access_token_enc, which never expires
  if (provider === "plaid" && row.plaid_access_token_enc) {
    return decryptToken(row.plaid_access_token_enc);
  }

  // OAuth tokens
  if (!row.access_token_enc) return null;

  if (!isTokenExpired(row)) {
    return decryptToken(row.access_token_enc);
  }

  // Token expired — attempt refresh (placeholder for Phase 4)
  if (!row.refresh_token_enc) {
    // No refresh token — mark as expired
    await admin
      .from("integration_tokens")
      .update({ status: "expired" })
      .eq("id", row.id);
    return null;
  }

  // TODO (Phase 4): Implement per-provider refresh token flow
  // For now, mark as expired
  await admin
    .from("integration_tokens")
    .update({ status: "expired" })
    .eq("id", row.id);
  return null;
}

/**
 * Store or update an integration token.
 */
export async function upsertIntegrationToken(params: {
  userId: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  plaidItemId?: string;
  plaidAccessToken?: string;
  providerUserId?: string;
  scopes?: string[];
}) {
  const admin = createAdminClient();

  const row: IntegrationTokenInsert = {
    user_id: params.userId,
    provider: params.provider,
    status: "active",
    access_token_enc: params.accessToken
      ? encryptToken(params.accessToken)
      : undefined,
    refresh_token_enc: params.refreshToken
      ? encryptToken(params.refreshToken)
      : undefined,
    token_expires_at: params.expiresAt
      ? params.expiresAt.toISOString()
      : undefined,
    plaid_item_id: params.plaidItemId ?? undefined,
    plaid_access_token_enc: params.plaidAccessToken
      ? encryptToken(params.plaidAccessToken)
      : undefined,
    provider_user_id: params.providerUserId ?? undefined,
    scopes: params.scopes ?? undefined,
  };

  await admin
    .from("integration_tokens")
    .upsert(row, { onConflict: "user_id,provider" });
}
