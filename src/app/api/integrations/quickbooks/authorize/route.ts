import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAuthUrl } from "@/lib/integrations/quickbooks";
import { randomBytes } from "crypto";

/**
 * GET /api/integrations/quickbooks/authorize
 * Redirects the user to QuickBooks OAuth consent screen.
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Generate CSRF state token encoding the user ID
  const nonce = randomBytes(16).toString("hex");
  const state = Buffer.from(
    JSON.stringify({ userId: user.id, nonce })
  ).toString("base64url");

  const authUrl = buildAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
