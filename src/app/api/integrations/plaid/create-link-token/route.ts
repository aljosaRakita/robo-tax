import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLinkToken } from "@/lib/integrations/plaid";
import { Products } from "plaid";

/**
 * POST /api/integrations/plaid/create-link-token
 * Creates a Plaid Link token for the authenticated user.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    // Default products; allow override for investment-specific flows
    const products: Products[] = body.products ?? [
      Products.Transactions,
    ];

    const linkToken = await createLinkToken(user.id, products);

    return NextResponse.json({ success: true, linkToken });
  } catch (err) {
    console.error("[plaid] create-link-token error:", err);
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 }
    );
  }
}
