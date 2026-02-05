import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Get the session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  // 2. LOGIC: Handle users visiting the Login page while already logged in
  if (isLoginPage && token) {
    // @ts-ignore
    const role = token.role; 

    // IF ADMIN: Send to Dashboard
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } 
    
    // IF CUSTOMER: Send to Home (or Account)
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. LOGIC: Protect Admin Routes
  if (isAdminPage) {
    // If not logged in -> Go to Login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If logged in but NOT admin -> Kick to Home
    // @ts-ignore
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// 4. Matcher
export const config = {
  matcher: ["/admin/:path*", "/login"],
};