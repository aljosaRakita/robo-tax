import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send reset email. Please try again." },
      { status: 500 }
    );
  }

  // Always return success to avoid email enumeration
  return NextResponse.json({ success: true });
}
