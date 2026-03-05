import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoUser, PLAID_POWER_UP_IDS } from "@/lib/demo";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isDemoUser(user.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Bulk-insert user_connections for all Plaid-backed power-ups
  const rows = PLAID_POWER_UP_IDS.map((id) => ({
    user_id: user.id,
    power_up_id: id,
    provider: "plaid",
    integration_status: "synced" as const,
  }));

  const { error } = await supabase.from("user_connections").upsert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, connected: PLAID_POWER_UP_IDS.length });
}
