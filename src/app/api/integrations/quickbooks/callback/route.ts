import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { exchangeCode } from "@/lib/integrations/quickbooks";
import { upsertIntegrationToken } from "@/lib/integrations/token-refresh";
import { syncProvider } from "@/lib/integrations/sync";

/**
 * GET /api/integrations/quickbooks/callback
 * Handles the OAuth redirect from QuickBooks, exchanges the code,
 * stores tokens, and kicks off data sync.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const realmId = url.searchParams.get("realmId");
  const state = url.searchParams.get("state");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!code || !realmId || !state) {
    return NextResponse.redirect(
      `${siteUrl}/dashboard?qbo_error=missing_params`
    );
  }

  // Decode state to get userId
  let userId: string;
  try {
    const parsed = JSON.parse(
      Buffer.from(state, "base64url").toString("utf8")
    );
    userId = parsed.userId;
  } catch {
    return NextResponse.redirect(
      `${siteUrl}/dashboard?qbo_error=invalid_state`
    );
  }

  // Verify the user is authenticated and matches the state
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return NextResponse.redirect(
      `${siteUrl}/dashboard?qbo_error=auth_mismatch`
    );
  }

  try {
    // Exchange code for tokens
    const { accessToken, refreshToken, expiresIn } = await exchangeCode(
      code,
      realmId
    );

    // Store encrypted tokens
    await upsertIntegrationToken({
      userId: user.id,
      provider: "quickbooks",
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      providerUserId: realmId,
      scopes: ["com.intuit.quickbooks.accounting"],
    });

    // Mark QuickBooks power-up as connected
    const admin = createAdminClient();
    await admin.from("user_connections").upsert(
      {
        user_id: user.id,
        power_up_id: "quickbooks",
        provider: "quickbooks",
        integration_status: "connected",
      },
      { onConflict: "user_id,power_up_id" }
    );

    // Kick off data sync in the background
    syncProvider(user.id, "quickbooks").catch((err) =>
      console.error("[qbo] Background sync error:", err)
    );

    return NextResponse.redirect(
      `${siteUrl}/dashboard?qbo_success=1`
    );
  } catch (err) {
    console.error("[qbo] callback error:", err);
    return NextResponse.redirect(
      `${siteUrl}/dashboard?qbo_error=exchange_failed`
    );
  }
}
