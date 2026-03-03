import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateSavings } from "@/lib/savings";
import type { SavingsResponse } from "@/lib/types";

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

  const estimate = await calculateSavings(user.id, allPowerUps, connectedSet);

  const response: SavingsResponse = {
    success: true,
    lowConfidence: false,
    estimate,
  };

  return NextResponse.json(response);
}
