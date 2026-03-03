import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runStrategyEngine } from "@/lib/strategy-engine";

/**
 * POST /api/strategies/analyze
 * Runs the strategy engine for the authenticated user.
 * Returns the array of strategy matches produced.
 */
export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const matches = await runStrategyEngine(user.id);

    return NextResponse.json({
      success: true,
      matchCount: matches.length,
      matches: matches.map((m) => ({
        strategyId: m.strategyId,
        estimatedLow: m.estimatedLow,
        estimatedBase: m.estimatedBase,
        estimatedHigh: m.estimatedHigh,
        confidence: m.confidence,
        reasoning: m.reasoning,
      })),
    });
  } catch (err) {
    console.error("[strategy-engine]", err);
    return NextResponse.json(
      { error: "Strategy analysis failed" },
      { status: 500 }
    );
  }
}
