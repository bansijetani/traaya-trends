import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find user in Sanity
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // 2. Check Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Create Session Token (JWT)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h") // Logged in for 24 hours
      .sign(secret);

    // 4. Set the Cookie
    const response = NextResponse.json({ 
        message: "Login successful", 
        user: { 
            name: user.name, 
            email: user.email, 
            role: user.role // 👈 Added this!
        } 
    });
    
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}