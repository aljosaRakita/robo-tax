import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/mock-data";
import { createSession } from "@/lib/mock-auth";

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 400));

  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await createSession(user.id, user.email);

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    },
  });
}
