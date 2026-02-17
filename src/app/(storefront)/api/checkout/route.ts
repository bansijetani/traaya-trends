import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, // Use the latest stable API version
});

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    const line_items = items.map((item: any) => {
      // 👇 1. Create a clear string of the variations
      const variantDetails = [item.selectedSize, item.selectedMaterial, item.selectedColor]
        .filter(Boolean)
        .join(" / ");

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            // 👇 2. Append the variations to the name so it appears on the invoice
            description: variantDetails ? `Variant: ${variantDetails}` : "Standard",
            images: [item.image],
            // 👇 3. Metadata for your internal Stripe dashboard
            metadata: {
              size: item.selectedSize || "N/A",
              material: item.selectedMaterial || "N/A",
              color: item.selectedColor || "N/A",
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: email,
      // 👇 4. Global Metadata for the entire order
      metadata: {
        order_details: items.map((i: any) => 
          `${i.name} (${[i.selectedSize, i.selectedMaterial, i.selectedColor].filter(Boolean).join(", ")}) x${i.quantity}`
        ).join(" | "),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}