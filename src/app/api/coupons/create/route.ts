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
    const body = await req.json();
    const { code, discountType, value, expiryDate, isActive, minSpend } = body;

    // 1. Basic Validation
    if (!code || !value) {
        return NextResponse.json({ message: "Code and Value are required" }, { status: 400 });
    }

    // 2. Check if code already exists (Prevent Duplicates)
    const existing = await client.fetch(`*[_type == "coupon" && code == $code][0]`, { code });
    if (existing) {
        return NextResponse.json({ message: "This coupon code already exists!" }, { status: 409 });
    }

    // 3. Create the Coupon
    await client.create({
      _type: "coupon",
      code: code.toUpperCase(),
      discountType,
      value: Number(value),
      minSpend: Number(minSpend) || 0,
      expiryDate: expiryDate || null,
      isActive
    });

    return NextResponse.json({ message: "Coupon created successfully!" });

  } catch (error: any) {
    console.error("Coupon API Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}