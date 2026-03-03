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

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      phone: profile.data?.phone ?? "",
      name: profile.data?.name ?? "",
      emailVerified: profile.data?.email_verified ?? false,
      phoneVerified: profile.data?.phone_verified ?? false,
    },
  });
}
