import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type StrategyMatchRow = Database["public"]["Tables"]["user_strategy_matches"]["Row"];

/**
 * GET /api/strategies/matches
 * Returns all strategy matches for the authenticated user,
 * enriched with strategy titles.
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: rawMatches } = await admin
    .from("user_strategy_matches")
    .select("*")
    .eq("user_id", user.id)
    .order("estimated_base", { ascending: false });

  const matches = (rawMatches ?? []) as StrategyMatchRow[];

  // Fetch strategy titles
  const strategyIds = matches.map((m) => m.strategy_id);
  const { data: strategies } = await admin
    .from("tax_strategies")
    .select("id, title")
    .in("id", strategyIds.length > 0 ? strategyIds : ["__none__"]);

  const titleMap = new Map(
    (strategies ?? []).map((s) => [s.id, s.title])
  );

  return NextResponse.json({
    success: true,
    matches: matches.map((m) => ({
      strategyId: m.strategy_id,
      strategyTitle: titleMap.get(m.strategy_id) ?? m.strategy_id,
      estimatedLow: m.estimated_low,
      estimatedBase: m.estimated_base,
      estimatedHigh: m.estimated_high,
      confidence: m.confidence,
      reasoning: m.reasoning,
      evidence: m.evidence,
      status: m.status,
    })),
  });
}
