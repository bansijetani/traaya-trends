import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Must be false for writing data
  token: process.env.SANITY_API_TOKEN, // 👈 Ensure this token has "Editor" permissions in Sanity
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { userId, action, role } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    // SCENARIO 1: DELETE USER
    if (action === 'delete') {
      console.log(`Deleting user: ${userId}`);
      await client.delete(userId);
      return NextResponse.json({ message: "User deleted successfully" });
    }

    // SCENARIO 2: UPDATE ROLE
    if (action === 'updateRole') {
      console.log(`Updating role for ${userId} to ${role}`);
      await client.patch(userId).set({ role: role }).commit();
      return NextResponse.json({ message: `Role updated to ${role}` });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Operation failed", error: error.message }, { status: 500 });
  }
}