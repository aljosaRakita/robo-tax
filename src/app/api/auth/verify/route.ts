import { NextResponse } from "next/server";
import { getSession } from "@/lib/mock-auth";
import { findUserById, checkVerificationCode } from "@/lib/mock-data";

export async function POST(request: Request) {
  await new Promise((r) => setTimeout(r, 300));

  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { type, code } = body;

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

  const valid = checkVerificationCode(session.userId, type, code);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Invalid verification code" },
      { status: 400 }
    );
  }

  const user = findUserById(session.userId);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  if (type === "email") user.emailVerified = true;
  if (type === "phone") user.phoneVerified = true;

  return NextResponse.json({
    success: true,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    fullyVerified: user.emailVerified && user.phoneVerified,
  });
}
