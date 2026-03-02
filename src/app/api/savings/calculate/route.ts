import { NextResponse } from "next/server";
import { getSession } from "@/lib/mock-auth";
import { powerUps, calculateSavings } from "@/lib/mock-data";
import type { SavingsResponse } from "@/lib/types";

const LOW_CONFIDENCE_THRESHOLD = 30;

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 2000));

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const connectedIds: string[] = body.connectedIds ?? [];
  const connectedSet = new Set(connectedIds);

  const percentage =
    powerUps.length > 0
      ? Math.round((connectedSet.size / powerUps.length) * 100)
      : 0;

  if (percentage < LOW_CONFIDENCE_THRESHOLD) {
    const response: SavingsResponse = {
      success: true,
      lowConfidence: true,
      warning: `You've only connected ${connectedSet.size} of ${powerUps.length} data sources (${percentage}%). Connect more sources for a more accurate estimate.`,
    };
    return NextResponse.json(response);
  }

  const estimate = calculateSavings(powerUps, connectedSet);

  const response: SavingsResponse = {
    success: true,
    lowConfidence: false,
    estimate,
  };

  return NextResponse.json(response);
}
