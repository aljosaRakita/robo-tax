import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { type, code, email } = body;

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

  // ── Email verification ──
  // Uses type "signup" to match the OTP sent by signUp / resend({ type: "signup" }).
  // Does NOT require an active session — the email address is passed from the client.
  if (type === "email") {
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required for email verification" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // verifyOtp for signup returns a session — use that user id
    const userId = data.user?.id;
    if (userId) {
      await supabase
        .from("profiles")
        .update({ email_verified: true })
        .eq("id", userId);
    }

    return NextResponse.json({
      success: true,
      emailVerified: true,
      phoneVerified: false,
      fullyVerified: false,
    });
  }

  // ── Phone verification ──
  // Requires an active session (email must already be verified).
  // Uses type "phone_change" to match the OTP sent by updateUser({ phone }).
  if (type === "phone") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please verify your email first" },
        { status: 401 }
      );
    }

    const phone = user.phone || user.user_metadata?.phone;
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "No phone number on file" },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "phone_change",
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    await supabase
      .from("profiles")
      .update({ phone_verified: true })
      .eq("id", user.id);

    // Fetch final state
    const { data: profile } = await supabase
      .from("profiles")
      .select("email_verified, phone_verified")
      .eq("id", user.id)
      .single();

    const emailVerified = profile?.email_verified ?? false;
    const phoneVerified = profile?.phone_verified ?? true;

    return NextResponse.json({
      success: true,
      emailVerified,
      phoneVerified,
      fullyVerified: emailVerified && phoneVerified,
    });
  }
}
