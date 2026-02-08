import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Must be false for live validation
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { code, email, orderTotal } = await req.json();

    if (!code) {
        return NextResponse.json({ message: "Code is required" }, { status: 400 });
    }

    // 1. Fetch Coupon from Sanity
    const coupon = await client.fetch(
        `*[_type == "coupon" && code == $code][0]`, 
        { code: code.toUpperCase() } // Input is case-insensitive
    );

    // 2. Checks: Existence
    if (!coupon) {
        return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    // 3. Checks: Active Status
    if (!coupon.isActive) {
        return NextResponse.json({ message: "This coupon is no longer active" }, { status: 400 });
    }

    // 4. Checks: Expiry Date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return NextResponse.json({ message: "This coupon has expired" }, { status: 400 });
    }

    // Is this user in the 'usedBy' list?
    if (email && coupon.usedBy && coupon.usedBy.includes(email)) {
        return NextResponse.json({ message: "You have already used this coupon!" }, { status: 406 });
    }

    // 👇 NEW CHECK: Minimum Spend
    // We expect 'orderTotal' to be passed from the frontend
    if (coupon.minSpend > 0 && orderTotal < coupon.minSpend) {
        return NextResponse.json({ 
            message: `This coupon requires a minimum spend of $${coupon.minSpend}.` 
        }, { status: 400 });
    }

    // 5. Success - Return Discount Details
    return NextResponse.json({ 
        valid: true, 
        discountType: coupon.discountType, // 'percentage' or 'fixed'
        value: coupon.value,
        message: "Coupon applied successfully!"
    });

  } catch (error: any) {
    console.error("Validation Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}