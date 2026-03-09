import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode(): string {
  return crypto.randomInt(100_000, 999_999).toString();
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, reason } = body;

  if (!name || !email || !phone) {
    return NextResponse.json(
      { success: false, error: "Name, email, and phone are required" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check for existing confirmed entry
  const { data: existing } = await admin
    .from("waitlist")
    .select("id, email_confirmed")
    .eq("email", email)
    .single();

  if (existing?.email_confirmed) {
    return NextResponse.json(
      { success: false, error: "This email is already on the waitlist" },
      { status: 409 }
    );
  }

  // Generate a 6-digit code valid for 10 minutes
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Upsert waitlist entry with code
  const { error: upsertError } = await admin.from("waitlist").upsert(
    {
      name,
      email,
      phone,
      reason: reason || null,
      email_confirmed: false,
      confirmation_code: code,
      code_expires_at: expiresAt,
    },
    { onConflict: "email" }
  );

  if (upsertError) {
    console.error("[waitlist] upsert error:", upsertError);
    return NextResponse.json(
      { success: false, error: "Failed to save your details" },
      { status: 500 }
    );
  }

  // Send verification email via Resend
  const { error: emailError } = await resend.emails.send({
    from: "RoboTax <onboarding@resend.dev>",
    to: email,
    subject: "Your RoboTax waitlist verification code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #10b981; margin-bottom: 8px;">RoboTax Waitlist</h2>
        <p>Hi ${name.split(" ")[0]},</p>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 24px; background: #f3f4f6; border-radius: 8px; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });

  if (emailError) {
    console.error("[waitlist] email error:", emailError);
    return NextResponse.json(
      { success: false, error: "Failed to send verification email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
