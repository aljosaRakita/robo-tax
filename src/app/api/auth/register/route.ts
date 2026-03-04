import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, phone, password, name } = body;

  if (!email || !phone || !password || !name) {
    return NextResponse.json(
      { success: false, error: "All fields are required" },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    const status = error.message.includes("already registered") ? 409 : 400;
    return NextResponse.json(
      { success: false, error: error.message },
      { status }
    );
  }

  const user = data.user;

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
        phone,
        name,
        emailVerified: false,
        phoneVerified: false,
      },
    },
    { status: 201 }
  );
}
