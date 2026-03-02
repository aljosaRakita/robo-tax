import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/mock-auth";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/register", "/verify"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session && pathname !== "/verify") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logos).*)"],
};
