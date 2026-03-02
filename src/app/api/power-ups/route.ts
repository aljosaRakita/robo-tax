import { NextResponse } from "next/server";
import { getSession } from "@/lib/mock-auth";
import { powerUps, categories, userConnections } from "@/lib/mock-data";
import type { PowerUpsResponse } from "@/lib/types";

export async function GET() {
  await new Promise((r) => setTimeout(r, 200));

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const connected = userConnections.get(session.userId) ?? new Set<string>();
  const total = powerUps.length;
  const connectedCount = connected.size;

  const enriched = powerUps.map((p) => ({
    ...p,
    connected: connected.has(p.id),
  }));

  const response: PowerUpsResponse = {
    powerUps: enriched,
    categories,
    stats: {
      total,
      connected: connectedCount,
      percentage: total > 0 ? Math.round((connectedCount / total) * 100) : 0,
    },
  };

  return NextResponse.json(response);
}
