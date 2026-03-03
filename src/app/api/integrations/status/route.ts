import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type ConnectionRow = Database["public"]["Tables"]["user_connections"]["Row"];

/**
 * GET /api/integrations/status
 * Returns the integration/sync status for all of the user's connections.
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

  const { data: rawConnections } = await admin
    .from("user_connections")
    .select("*")
    .eq("user_id", user.id);

  const connections = (rawConnections ?? []) as ConnectionRow[];

  const statuses = connections.map((c) => ({
    powerUpId: c.power_up_id,
    provider: c.provider,
    integrationStatus: c.integration_status,
    lastSyncedAt: c.last_synced_at,
  }));

  return NextResponse.json({ success: true, statuses });
}
