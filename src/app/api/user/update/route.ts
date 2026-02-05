import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // You likely need to run: npm install bcryptjs @types/bcryptjs

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, phone, currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    // 1. Fetch current user data (to get the password hash for verification)
    const user = await client.fetch(
        `*[_type == "user" && _id == $userId][0]`, 
        { userId }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Prepare the update object
    const updates: any = {
      name: name,
      phone: phone
    };

    // 3. Handle Password Change (Securely)
    if (newPassword) {
      if (!currentPassword) {
         return NextResponse.json({ message: "Current password is required to set a new one." }, { status: 400 });
      }

      // Verify old password matches database hash
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ message: "Incorrect current password." }, { status: 401 });
      }

      // Hash new password before saving
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.password = hashedPassword;
    }

    // 4. Commit Changes to Sanity
    await client.patch(userId).set(updates).commit();

    return NextResponse.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}