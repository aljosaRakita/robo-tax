import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, code } = body;

  if (!email || !code) {
    return NextResponse.json(
      { success: false, error: "Email and code are required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: entry, error } = await admin
    .from("waitlist")
    .select("id, confirmation_code, code_expires_at, email_confirmed")
    .eq("email", email)
    .single();

  if (error || !entry) {
    return NextResponse.json(
      { success: false, error: "No waitlist entry found for this email" },
      { status: 404 }
    );
  }

  if (entry.email_confirmed) {
    return NextResponse.json({ success: true });
  }

  if (!entry.confirmation_code || entry.confirmation_code !== code) {
    return NextResponse.json(
      { success: false, error: "Invalid verification code" },
      { status: 400 }
    );
  }

  if (entry.code_expires_at && new Date(entry.code_expires_at) < new Date()) {
    return NextResponse.json(
      { success: false, error: "Verification code has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // Mark confirmed and clear the code
  await admin
    .from("waitlist")
    .update({ email_confirmed: true, confirmation_code: null, code_expires_at: null })
    .eq("email", email);

  return NextResponse.json({ success: true });
}
