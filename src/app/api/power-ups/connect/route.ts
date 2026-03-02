import { NextResponse } from "next/server";
import { getSession } from "@/lib/mock-auth";
import { userConnections, powerUps } from "@/lib/mock-data";

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 600));

  const session = await getSession();
  if (!session) {
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

  const exists = powerUps.some((p) => p.id === powerUpId);
  if (!exists) {
    return NextResponse.json({ error: "Power-up not found" }, { status: 404 });
  }

  const connections = userConnections.get(session.userId) ?? new Set<string>();

  if (action === "connect") {
    connections.add(powerUpId);
  } else if (action === "disconnect") {
    connections.delete(powerUpId);
  } else {
    return NextResponse.json(
      { error: "Action must be 'connect' or 'disconnect'" },
      { status: 400 }
    );
  }

  userConnections.set(session.userId, connections);

  const total = powerUps.length;
  const connectedCount = connections.size;

  return NextResponse.json({
    success: true,
    powerUpId,
    action,
    stats: {
      total,
      connected: connectedCount,
      percentage: total > 0 ? Math.round((connectedCount / total) * 100) : 0,
    },
  });
}
