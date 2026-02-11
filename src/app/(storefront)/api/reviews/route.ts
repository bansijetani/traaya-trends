import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, name, rating, comment } = body;

    if (!productId || !name || !rating) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const review = await client.create({
      _type: "review",
      product: { _type: "reference", _ref: productId },
      name,
      rating: Number(rating),
      comment,
      status: "pending", // 👈 FORCE PENDING STATUS
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Review submitted for approval", review }, { status: 200 });

  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}