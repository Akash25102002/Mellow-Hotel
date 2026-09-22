import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-founddesk-key-min-32-chars-long";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "founddesk_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/items") ||
    pathname.startsWith("/inquiries-admin");

  const isAuthPage = pathname === "/login";

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  if (isProtectedPage && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/items/:path*",
    "/inquiries-admin/:path*",
    "/login",
  ],
};
