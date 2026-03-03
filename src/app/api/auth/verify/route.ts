import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { type, code } = body;

  if (!type || !code) {
    return NextResponse.json(
      { success: false, error: "Type and code are required" },
      { status: 400 }
    );
  }

  if (type !== "email" && type !== "phone") {
    return NextResponse.json(
      { success: false, error: "Type must be 'email' or 'phone'" },
      { status: 400 }
    );
  }

  if (type === "email") {
    const { error } = await supabase.auth.verifyOtp({
      email: user.email!,
      token: code,
      type: "email",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }

    await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", user.id);
  }

  if (type === "phone") {
    const phone = user.user_metadata?.phone;
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "No phone number on file" },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      );
    }

    await supabase
      .from("profiles")
      .update({ phone_verified: true })
      .eq("id", user.id);
  }

  // Fetch updated profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email_verified, phone_verified")
    .eq("id", user.id)
    .single();

  const emailVerified = profile?.email_verified ?? false;
  const phoneVerified = profile?.phone_verified ?? false;

  return NextResponse.json({
    success: true,
    emailVerified,
    phoneVerified,
    fullyVerified: emailVerified && phoneVerified,
  });
}
