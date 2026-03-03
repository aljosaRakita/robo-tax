import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateSavings } from "@/lib/savings";
import type { SavingsResponse } from "@/lib/types";

const LOW_CONFIDENCE_THRESHOLD = 30;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const connectedIds: string[] = body.connectedIds ?? [];
  const connectedSet = new Set(connectedIds);

  // Fetch all enabled power-ups from DB
  const { data: powerUps } = await supabase
    .from("power_ups")
    .select("id, savings_weight");

  const allPowerUps = (powerUps ?? []).map((p) => ({
    id: p.id,
    savingsWeight: p.savings_weight,
  }));

  const total = allPowerUps.length;
  const percentage =
    total > 0 ? Math.round((connectedSet.size / total) * 100) : 0;

  if (percentage < LOW_CONFIDENCE_THRESHOLD) {
    const response: SavingsResponse = {
      success: true,
      lowConfidence: true,
      warning: `You've only connected ${connectedSet.size} of ${total} data sources (${percentage}%). Connect more sources for a more accurate estimate.`,
    };
    return NextResponse.json(response);
  }

  const estimate = await calculateSavings(user.id, allPowerUps, connectedSet);

  const response: SavingsResponse = {
    success: true,
    lowConfidence: false,
    estimate,
  };

  return NextResponse.json(response);
}
