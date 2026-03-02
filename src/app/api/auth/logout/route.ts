import { NextResponse } from "next/server";
import { destroySession } from "@/lib/mock-auth";

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
