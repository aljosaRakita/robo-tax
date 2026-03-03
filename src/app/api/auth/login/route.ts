import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const user = data.user;
  const profile = await supabase
    .from("profiles")
    .select("name, phone, email_verified, phone_verified")
    .eq("id", user.id)
    .single();

  // Check both our profiles table AND Supabase's email_confirmed_at as fallback.
  // The link-click flow confirms the email in Supabase but may not update our table.
  const supabaseEmailConfirmed = !!user.email_confirmed_at;
  const profileEmailVerified = profile.data?.email_verified ?? false;
  const emailVerified = profileEmailVerified || supabaseEmailConfirmed;

  // If Supabase says confirmed but our table is stale, sync it
  if (supabaseEmailConfirmed && !profileEmailVerified) {
    await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", user.id);
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      phone: profile.data?.phone ?? user.user_metadata?.phone ?? "",
      name: profile.data?.name ?? user.user_metadata?.name ?? "",
      emailVerified,
      phoneVerified: profile.data?.phone_verified ?? false,
    },
  });
}
