import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 👇 1. Use NextAuth's getToken to get the correct session
  // This looks for "next-auth.session-token" automatically
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  // 2. LOGIC: If user is already logged in, kick them OUT of the login page
  // (So they go straight to dashboard)
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // 3. LOGIC: Protect Admin Routes
  if (isAdminPage) {
    // If not logged in at all -> Login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Optional: Check for 'admin' role if you set that up in [...nextauth]/route.ts
    // @ts-ignore
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); // Kick non-admins to home
    }
  }

  return NextResponse.next();
}

// 4. Specify routes to protect
export const config = {
  matcher: ["/admin/:path*", "/login"],
};