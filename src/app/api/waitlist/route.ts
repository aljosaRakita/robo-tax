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
  const { name, email, phone, reason, sendVerification } = body;

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required" },
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

  if (sendVerification) {
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required to verify" },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

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
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "Your RoboTax waitlist verification code",
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">RoboTax Waitlist</h2>
          <p style="color: #888; font-size: 14px;">Hi ${name.split(" ")[0]},</p>
          <p style="color: #888; font-size: 14px;">Your verification code is:</p>
          <div style="font-size: 32px; font-weight: 600; letter-spacing: 8px; text-align: center; padding: 24px; background: #111; color: #fff; border-radius: 8px; margin: 16px 0; font-family: monospace;">
            ${code}
          </div>
          <p style="color: #666; font-size: 13px;">This code expires in 10 minutes.</p>
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

  // Partial save — no verification email
  const { error: upsertError } = await admin.from("waitlist").upsert(
    {
      name: name || "",
      email,
      phone: phone || "",
      reason: reason || null,
      email_confirmed: false,
    },
    { onConflict: "email" }
  );

  if (upsertError) {
    console.error("[waitlist] partial save error:", upsertError);
    return NextResponse.json(
      { success: false, error: "Failed to save your details" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
