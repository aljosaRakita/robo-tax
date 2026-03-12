import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoUser } from "@/lib/demo";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isDemoUser(user.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await request.json();
  const { powerUpId } = body;

  if (!powerUpId) {
    return NextResponse.json({ error: "powerUpId is required" }, { status: 400 });
  }

  // Connect only the specific power-up the user selected
  const { error } = await supabase.from("user_connections").upsert({
    user_id: user.id,
    power_up_id: powerUpId,
    provider: "plaid",
    integration_status: "synced",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, connected: 1 });
}
