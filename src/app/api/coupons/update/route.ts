import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // 👈 Must have "Editor" permissions
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { id, action, isActive } = await req.json();

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    // ACTION: TOGGLE STATUS
    if (action === 'toggle') {
      await client.patch(id).set({ isActive: isActive }).commit();
      return NextResponse.json({ message: "Status updated" });
    }

    // ACTION: DELETE COUPON
    if (action === 'delete') {
      await client.delete(id);
      return NextResponse.json({ message: "Coupon deleted" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Operation failed", error: error.message }, { status: 500 });
  }
}