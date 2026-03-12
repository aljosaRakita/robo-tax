import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    .select("id, name, confirmation_code, code_expires_at, email_confirmed")
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

  // Send confirmation email
  const firstName = entry.name?.split(" ")[0] || "there";
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "You're on the RoboTax waitlist!",
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">RoboTax</h2>
          <p style="color: #888; font-size: 14px;">Hi ${firstName},</p>
          <p style="color: #ccc; font-size: 14px; line-height: 1.6;">
            You're officially on the waitlist. We'll notify you as soon as early access is available.
          </p>
          <p style="color: #ccc; font-size: 14px; line-height: 1.6;">
            In the meantime, keep an eye on your inbox — we'll share updates and tips to help you get the most out of RoboTax when it launches.
          </p>
          <p style="color: #666; font-size: 13px; margin-top: 24px;">— The RoboTax Team</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("[waitlist] confirmation email error:", emailError);
    // Don't fail the verification if the confirmation email fails to send
  }

  return NextResponse.json({ success: true });
}
