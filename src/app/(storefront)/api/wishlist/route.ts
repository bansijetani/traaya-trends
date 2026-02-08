import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// 👇 Create a WRITE client explicitly for this API route
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // 👈 Uses the token you just added
  useCdn: false, // We must NOT use CDN for writing updates
});

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    // 1. Fetch current wishlist
    const user = await client.fetch(
      `*[_type == "user" && _id == $userId][0]{ wishlist }`,
      { userId }
    );

    const wishlist = user?.wishlist || [];
    const exists = wishlist.some((item: any) => item._ref === productId);

    if (exists) {
      // 🚨 REMOVE
      await client
        .patch(userId)
        .unset([`wishlist[_ref=="${productId}"]`])
        .commit();
      
      return NextResponse.json({ message: "Removed from Wishlist", active: false });
    } else {
      // ✅ ADD
      await client
        .patch(userId)
        .setIfMissing({ wishlist: [] })
        .append("wishlist", [
            { 
                _type: "reference", 
                _ref: productId, 
                _key: crypto.randomUUID() 
            }
        ])
        .commit();

      return NextResponse.json({ message: "Added to Wishlist", active: true });
    }

  } catch (error) {
    console.error("Wishlist Error:", error);
    return NextResponse.json({ message: "Error updating wishlist" }, { status: 500 });
  }
}