import { NextResponse } from "next/server";
import {
  createUser,
  findUserByEmail,
  generateVerificationCode,
} from "@/lib/mock-data";
import { createSession } from "@/lib/mock-auth";

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 500));

  const body = await request.json();
  const { email, phone, password, name } = body;

  if (!email || !phone || !password || !name) {
    return NextResponse.json(
      { success: false, error: "All fields are required" },
      { status: 400 }
    );
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const user = createUser({ email, phone, password, name });

  generateVerificationCode(user.id, "email");
  generateVerificationCode(user.id, "phone");

  await createSession(user.id, user.email);

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
      verificationHint: "Use code 123456 for both email and phone",
    },
    { status: 201 }
  );
}
