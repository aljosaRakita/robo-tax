import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { type, email, phone } = body;

  if (!type || (type !== "email" && type !== "phone")) {
    return NextResponse.json(
      { success: false, error: "Type must be 'email' or 'phone'" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const origin = new URL(request.url).origin;

  if (type === "email") {
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Resend the signup confirmation email — does not require an active session
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      // Rate-limit or other errors — return generic message to avoid enumeration
      return NextResponse.json(
        { success: false, error: "Unable to send code. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json({ success: true });
  }

  // Phone: requires an active session (email must be verified first)
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

    const targetPhone = phone || user.user_metadata?.phone;
    if (!targetPhone) {
      return NextResponse.json(
        { success: false, error: "No phone number on file" },
        { status: 400 }
      );
    }

    // updateUser({ phone }) triggers Supabase to send an SMS OTP
    const { error } = await supabase.auth.updateUser({
      phone: targetPhone,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Unable to send code. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json({ success: true });
  }
}
