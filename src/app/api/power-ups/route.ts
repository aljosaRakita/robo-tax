import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PowerUpCategory, PowerUpsResponse } from "@/lib/types";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch categories ordered by sort_order
  const { data: categories } = await supabase
    .from("categories")
    .select("id, label, icon, description")
    .order("sort_order");

  // Fetch enabled power-ups
  const { data: powerUps } = await supabase
    .from("power_ups")
    .select("id, name, description, category_id, logo_url, savings_weight, is_native");

  // Fetch user's connections
  const { data: connections } = await supabase
    .from("user_connections")
    .select("power_up_id")
    .eq("user_id", user.id);

  const connectedSet = new Set(
    (connections ?? []).map((c) => c.power_up_id)
  );

  const enriched = (powerUps ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category_id as PowerUpCategory,
    logoUrl: p.logo_url,
    savingsWeight: p.savings_weight,
    connected: connectedSet.has(p.id),
    isNative: p.is_native,
  }));

  const total = enriched.length;
  const connectedCount = connectedSet.size;

  const response: PowerUpsResponse = {
    powerUps: enriched,
    categories: (categories ?? []).map((c) => ({
      id: c.id as PowerUpsResponse["categories"][number]["id"],
      label: c.label,
      icon: c.icon,
      description: c.description,
    })),
    stats: {
      total,
      connected: connectedCount,
      percentage: total > 0 ? Math.round((connectedCount / total) * 100) : 0,
    },
  };

  return NextResponse.json(response);
}
