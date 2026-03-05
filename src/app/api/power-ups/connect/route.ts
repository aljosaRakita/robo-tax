import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requiresPlaidLink, getProviderForPowerUp } from "@/lib/integrations/index";
import { createLinkToken } from "@/lib/integrations/plaid";
import { Products } from "plaid";
import { isDemoUser } from "@/lib/demo";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { powerUpId, action } = body;

  if (!powerUpId || !action) {
    return NextResponse.json(
      { error: "powerUpId and action are required" },
      { status: 400 }
    );
  }

  // Verify power-up exists
  const { data: powerUp } = await supabase
    .from("power_ups")
    .select("id")
    .eq("id", powerUpId)
    .single();

  if (!powerUp) {
    return NextResponse.json({ error: "Power-up not found" }, { status: 404 });
  }

  if (action === "connect") {
    // Demo user: special handling
    if (isDemoUser(user.email)) {
      if (requiresPlaidLink(powerUpId)) {
        // Tell the client to show the mock Plaid modal instead
        return NextResponse.json({
          success: true,
          requiresDemoPlaid: true,
        });
      }

      // Non-Plaid demo connect: instant synced status
      const provider = getProviderForPowerUp(powerUpId);
      const { error } = await supabase
        .from("user_connections")
        .upsert({
          user_id: user.id,
          power_up_id: powerUpId,
          provider: provider?.id ?? null,
          integration_status: "synced",
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Return stats for demo
      const { count: connectedCount } = await supabase
        .from("user_connections")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      const { count: totalCount } = await supabase
        .from("power_ups")
        .select("*", { count: "exact", head: true });
      const total = totalCount ?? 0;
      const connected = connectedCount ?? 0;

      return NextResponse.json({
        success: true,
        powerUpId,
        action,
        stats: {
          total,
          connected,
          percentage: total > 0 ? Math.round((connected / total) * 100) : 0,
        },
      });
    }

    // Check if this power-up needs Plaid Link
    if (requiresPlaidLink(powerUpId)) {
      try {
        // Determine which Plaid products to request
        const provider = getProviderForPowerUp(powerUpId);
        const products: Products[] = [Products.Transactions];

        // Add investments for brokerage/investment power-ups
        const investmentPowerUps = [
          "fidelity", "robinhood", "vanguard", "schwab",
          "coinbase", "kraken", "gemini", "binance-us",
        ];
        if (investmentPowerUps.includes(powerUpId)) {
          products.push(Products.Investments);
        }

        const linkToken = await createLinkToken(user.id, products);

        return NextResponse.json({
          success: true,
          requiresPlaid: true,
          linkToken,
          provider: provider?.id ?? "plaid",
        });
      } catch (err) {
        console.error("[connect] Plaid link token error:", err);
        return NextResponse.json(
          { error: "Failed to create Plaid link token" },
          { status: 500 }
        );
      }
    }

    // Non-Plaid connect: simple toggle
    const provider = getProviderForPowerUp(powerUpId);
    const { error } = await supabase
      .from("user_connections")
      .upsert({
        user_id: user.id,
        power_up_id: powerUpId,
        provider: provider?.id ?? null,
        integration_status: provider ? "pending" : "connected",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (action === "disconnect") {
    const { error } = await supabase
      .from("user_connections")
      .delete()
      .eq("user_id", user.id)
      .eq("power_up_id", powerUpId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { error: "Action must be 'connect' or 'disconnect'" },
      { status: 400 }
    );
  }

  // Get updated stats
  const { count: connectedCount } = await supabase
    .from("user_connections")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: totalCount } = await supabase
    .from("power_ups")
    .select("*", { count: "exact", head: true });

  const total = totalCount ?? 0;
  const connected = connectedCount ?? 0;

  return NextResponse.json({
    success: true,
    powerUpId,
    action,
    stats: {
      total,
      connected,
      percentage: total > 0 ? Math.round((connected / total) * 100) : 0,
    },
  });
}
