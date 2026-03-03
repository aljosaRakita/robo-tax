import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const origin = new URL(request.url).origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Mark email as verified in our profiles table
      await supabase
        .from("profiles")
        .update({ email_verified: true })
        .eq("id", data.user.id);

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange fails, redirect to login with an error
  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}
