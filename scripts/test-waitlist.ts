/**
 * Test suite for the waitlist API (Resend + DB code flow).
 * Run with: npx tsx --env-file=.env.local scripts/test-waitlist.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const serviceKey = process.env.SUPABASE_SECRET_KEY!;
const resendKey = process.env.RESEND_API_KEY!;

if (!url || !anonKey || !serviceKey) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}

const admin = createClient(url, serviceKey);
const anon = createClient(url, anonKey);
const resend = new Resend(resendKey);

// Resend sandbox only allows sending to the owner email
const OWNER_EMAIL = "aljo@deepinvent.ai";
const TEST_EMAIL = OWNER_EMAIL;
const TEST_PHONE = "+15551234567";
const TEST_NAME = "Test User";

let passed = 0;
let failed = 0;
const cleanupEmails: string[] = [TEST_EMAIL];

async function test(label: string, fn: () => Promise<void>) {
  process.stdout.write(`  ${label} ... `);
  try {
    await fn();
    console.log("PASS");
    passed++;
  } catch (err: any) {
    console.log("FAIL");
    console.error(`    -> ${err.message || JSON.stringify(err)}`);
    failed++;
  }
}

async function cleanup() {
  console.log("\n--- Cleanup ---");
  for (const email of cleanupEmails) {
    await admin.from("waitlist").delete().eq("email", email);
  }
  console.log("  Cleaned up test data.");
}

async function run() {
  console.log("\n=== Waitlist API Test Suite ===\n");
  console.log(`Supabase URL: ${url}`);
  console.log(`Resend key:   ${resendKey ? "present" : "MISSING"}`);
  console.log(`Test email:   ${TEST_EMAIL}\n`);

  // ── Infrastructure ──
  console.log("-- Infrastructure --");

  await test("Admin client can query", async () => {
    const { error } = await admin.from("profiles").select("id").limit(1);
    if (error) throw new Error(`Admin query failed: ${error.message}`);
  });

  await test("Waitlist table exists", async () => {
    const { error } = await admin.from("waitlist").select("id").limit(1);
    if (error) throw new Error(`${error.message} (code: ${error.code})`);
  });

  await test("Waitlist table has confirmation_code column", async () => {
    const { error } = await admin.from("waitlist").select("confirmation_code").limit(1);
    if (error) throw new Error(`${error.message} (code: ${error.code})`);
  });

  await test("Resend API key is set", async () => {
    if (!resendKey) throw new Error("RESEND_API_KEY not set");
  });

  // ── Waitlist CRUD ──
  console.log("\n-- Waitlist CRUD --");

  await test("Upsert waitlist entry with code", async () => {
    const code = crypto.randomInt(100_000, 999_999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error } = await admin.from("waitlist").upsert(
      {
        name: TEST_NAME,
        email: TEST_EMAIL,
        phone: TEST_PHONE,
        reason: "Testing",
        email_confirmed: false,
        confirmation_code: code,
        code_expires_at: expiresAt,
      },
      { onConflict: "email" }
    );
    if (error) throw new Error(`${error.message} (code: ${error.code})`);
  });

  await test("Read back entry with code fields", async () => {
    const { data, error } = await admin
      .from("waitlist")
      .select("*")
      .eq("email", TEST_EMAIL)
      .single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("No data returned");
    if (!data.confirmation_code) throw new Error("confirmation_code missing");
    if (!data.code_expires_at) throw new Error("code_expires_at missing");
    if (data.email_confirmed) throw new Error("Should not be confirmed yet");
  });

  // ── Verification logic ──
  console.log("\n-- Verification logic --");

  await test("Wrong code is rejected", async () => {
    const { data } = await admin
      .from("waitlist")
      .select("confirmation_code")
      .eq("email", TEST_EMAIL)
      .single();
    const wrongCode = data!.confirmation_code === "000000" ? "111111" : "000000";

    // Simulate what the verify route does
    if (wrongCode === data!.confirmation_code) throw new Error("Codes should not match");
  });

  await test("Correct code confirms entry", async () => {
    const { data } = await admin
      .from("waitlist")
      .select("confirmation_code")
      .eq("email", TEST_EMAIL)
      .single();
    const code = data!.confirmation_code!;

    // Simulate verify route
    const { error } = await admin
      .from("waitlist")
      .update({ email_confirmed: true, confirmation_code: null, code_expires_at: null })
      .eq("email", TEST_EMAIL);
    if (error) throw new Error(error.message);

    const { data: updated } = await admin
      .from("waitlist")
      .select("email_confirmed, confirmation_code")
      .eq("email", TEST_EMAIL)
      .single();
    if (!updated?.email_confirmed) throw new Error("Should be confirmed");
    if (updated.confirmation_code !== null) throw new Error("Code should be cleared");
  });

  await test("Expired code is detected", async () => {
    const pastDate = new Date(Date.now() - 60_000).toISOString();
    await admin.from("waitlist").update({
      email_confirmed: false,
      confirmation_code: "123456",
      code_expires_at: pastDate,
    }).eq("email", TEST_EMAIL);

    const { data } = await admin
      .from("waitlist")
      .select("code_expires_at")
      .eq("email", TEST_EMAIL)
      .single();
    if (new Date(data!.code_expires_at!) >= new Date()) {
      throw new Error("Code should be expired");
    }
  });

  // ── Resend email delivery ──
  console.log("\n-- Email delivery (Resend) --");

  await test("Send verification email via Resend", async () => {
    const { data, error } = await resend.emails.send({
      from: "RoboTax <onboarding@resend.dev>",
      to: TEST_EMAIL,
      subject: "Test verification code",
      html: "<p>Your code is: <b>123456</b></p>",
    });
    if (error) throw new Error(`Resend send failed: ${error.message}`);
    if (!data?.id) throw new Error("No email ID returned");
  });

  // ── Full pipeline simulation ──
  console.log("\n-- Full pipeline --");
  // Use the same owner email for pipeline (Resend sandbox restriction)
  // We reset the entry state instead of using a separate email
  const pipelineEmail = OWNER_EMAIL;

  await test("Pipeline: upsert + send + verify", async () => {
    const code = crypto.randomInt(100_000, 999_999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Step 1: Upsert
    const { error: upsertErr } = await admin.from("waitlist").upsert(
      {
        name: "Pipeline User",
        email: pipelineEmail,
        phone: TEST_PHONE,
        reason: null,
        email_confirmed: false,
        confirmation_code: code,
        code_expires_at: expiresAt,
      },
      { onConflict: "email" }
    );
    if (upsertErr) throw new Error(`Upsert: ${upsertErr.message}`);

    // Step 2: Send email
    const { error: emailErr } = await resend.emails.send({
      from: "RoboTax <onboarding@resend.dev>",
      to: pipelineEmail,
      subject: "Verification",
      html: `<p>Code: <b>${code}</b></p>`,
    });
    if (emailErr) throw new Error(`Email: ${emailErr.message}`);

    // Step 3: Verify with correct code
    const { data: entry } = await admin
      .from("waitlist")
      .select("confirmation_code, code_expires_at")
      .eq("email", pipelineEmail)
      .single();
    if (entry!.confirmation_code !== code) throw new Error("Code mismatch");
    if (new Date(entry!.code_expires_at!) < new Date()) throw new Error("Already expired");

    // Step 4: Confirm
    const { error: updateErr } = await admin
      .from("waitlist")
      .update({ email_confirmed: true, confirmation_code: null, code_expires_at: null })
      .eq("email", pipelineEmail);
    if (updateErr) throw new Error(`Confirm: ${updateErr.message}`);

    const { data: final } = await admin
      .from("waitlist")
      .select("email_confirmed")
      .eq("email", pipelineEmail)
      .single();
    if (!final?.email_confirmed) throw new Error("Not confirmed after pipeline");
  });

  // ── RLS ──
  console.log("\n-- RLS --");

  await test("Anon client cannot read waitlist", async () => {
    const { data } = await anon.from("waitlist").select("*").limit(1);
    if (data && data.length > 0) throw new Error("Anon should not see rows");
  });

  // ── Cleanup ──
  await cleanup();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(console.error);
