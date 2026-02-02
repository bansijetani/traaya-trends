import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 1. Find user with this token
    // We also check if 'resetTokenExpiry' is in the future
    const query = `*[_type == "user" && resetToken == $token][0]`;
    const user = await client.fetch<any>(query, { token });

    if (!user) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Check Expiry Time
    const now = Date.now();
    if (user.resetTokenExpiry && now > user.resetTokenExpiry) {
        return NextResponse.json({ message: "Token has expired. Request a new one." }, { status: 400 });
    }

    // 3. Hash the new Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Update Sanity
    await client.patch(user._id)
        .set({ password: hashedPassword })
        .unset(['resetToken', 'resetTokenExpiry']) // Clear the token so it can't be used again
        .commit();

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}