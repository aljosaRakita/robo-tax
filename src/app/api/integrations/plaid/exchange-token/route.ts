import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { exchangePublicToken } from "@/lib/integrations/plaid";
import { upsertIntegrationToken } from "@/lib/integrations/token-refresh";
import { syncProvider } from "@/lib/integrations/sync";

/**
 * POST /api/integrations/plaid/exchange-token
 * Exchanges a Plaid public_token for an access_token,
 * stores it encrypted, updates connection status, and kicks off sync.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { publicToken, powerUpId } = body;

  if (!publicToken) {
    return NextResponse.json(
      { error: "publicToken is required" },
      { status: 400 }
    );
  }

  try {
    // Exchange public token for permanent access token
    const { accessToken, itemId } = await exchangePublicToken(publicToken);

    // Store encrypted token
    await upsertIntegrationToken({
      userId: user.id,
      provider: "plaid",
      plaidAccessToken: accessToken,
      plaidItemId: itemId,
    });

    // Update user_connections for the specific power-up only
    const admin = createAdminClient();

    if (powerUpId) {
      await admin
        .from("user_connections")
        .upsert(
          {
            user_id: user.id,
            power_up_id: powerUpId,
            provider: "plaid",
            integration_status: "connected",
          },
          { onConflict: "user_id,power_up_id" }
        );
    }

    // Kick off data sync in the background
    syncProvider(user.id, "plaid").catch((err) =>
      console.error("[plaid] Background sync error:", err)
    );

    return NextResponse.json({
      success: true,
      itemId,
      message: "Token exchanged — data sync in progress",
    });
  } catch (err) {
    console.error("[plaid] exchange-token error:", err);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 }
    );
  }
}
