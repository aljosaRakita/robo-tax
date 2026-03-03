// ============================================================
// Sync Orchestrator
// Coordinates data syncing across all connected providers.
// Currently implements Plaid sync; future phases add OAuth providers.
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import {
  syncAccounts,
  syncTransactions,
  syncHoldings,
  getPlaidAccessToken,
} from "@/lib/integrations/plaid";
import { runStrategyEngine } from "@/lib/strategy-engine";

export interface SyncResult {
  provider: string;
  success: boolean;
  dataTypes: string[];
  error?: string;
}

/**
 * Sync all data for a given user and provider.
 * After syncing, automatically runs the strategy engine.
 */
export async function syncProvider(
  userId: string,
  provider: string
): Promise<SyncResult> {
  const admin = createAdminClient();

  try {
    if (provider === "plaid") {
      return await syncPlaidData(userId);
    }

    // Future: OAuth provider sync
    return {
      provider,
      success: false,
      dataTypes: [],
      error: `Provider "${provider}" sync not yet implemented`,
    };
  } finally {
    // Always run strategy engine after sync attempt
    try {
      await runStrategyEngine(userId);
    } catch (err) {
      console.error("[sync] Strategy engine error:", err);
    }

    // Update connection status
    await admin
      .from("user_connections")
      .update({
        integration_status: "synced",
        last_synced_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("provider", provider);
  }
}

/**
 * Sync all Plaid data for a user: accounts, transactions, and holdings.
 */
async function syncPlaidData(userId: string): Promise<SyncResult> {
  const accessToken = await getPlaidAccessToken(userId);

  if (!accessToken) {
    return {
      provider: "plaid",
      success: false,
      dataTypes: [],
      error: "No active Plaid access token found",
    };
  }

  const admin = createAdminClient();
  const syncedTypes: string[] = [];

  // Update status to syncing
  await admin
    .from("user_connections")
    .update({ integration_status: "syncing" })
    .eq("user_id", userId)
    .eq("provider", "plaid");

  try {
    // Sync accounts first (fast, always available)
    await syncAccounts(userId, accessToken);
    syncedTypes.push("accounts");

    // Sync transactions (may take longer)
    await syncTransactions(userId, accessToken);
    syncedTypes.push("transactions");

    // Sync holdings (only if investment products are available)
    await syncHoldings(userId, accessToken);
    syncedTypes.push("holdings");
  } catch (err) {
    console.error("[plaid-sync] Error during sync:", err);

    await admin
      .from("user_connections")
      .update({ integration_status: "error" })
      .eq("user_id", userId)
      .eq("provider", "plaid");

    return {
      provider: "plaid",
      success: syncedTypes.length > 0,
      dataTypes: syncedTypes,
      error: err instanceof Error ? err.message : "Sync failed",
    };
  }

  return {
    provider: "plaid",
    success: true,
    dataTypes: syncedTypes,
  };
}

/**
 * Sync all connected providers for a user.
 * Returns results per provider.
 */
export async function syncAllProviders(
  userId: string
): Promise<SyncResult[]> {
  const admin = createAdminClient();

  // Find distinct providers the user has connected
  const { data: connections } = await admin
    .from("user_connections")
    .select("provider")
    .eq("user_id", userId)
    .not("provider", "is", null);

  const providers = [
    ...new Set(
      (connections ?? [])
        .map((c) => (c as { provider: string | null }).provider)
        .filter(Boolean) as string[]
    ),
  ];

  const results: SyncResult[] = [];
  for (const provider of providers) {
    const result = await syncProvider(userId, provider);
    results.push(result);
  }

  return results;
}
