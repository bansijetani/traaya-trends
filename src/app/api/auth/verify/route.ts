import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  try {
    // 👇 FIX: Add 'as any' to the parameters object
    const user = await client.fetch(
        `*[_type == "user" && verificationToken == $token][0]`, 
        { token } as any
    );

    if (!user) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    await client.patch(user._id)
        .set({ isVerified: true })
        .unset(['verificationToken']) 
        .commit();

    return NextResponse.redirect(new URL('/login?verified=true', req.url));

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}