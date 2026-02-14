import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any, // Use the latest stable API version
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body; // The items coming from your shopping cart

    // Format your cart items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd", // Change this to 'inr' or 'eur' if needed
        product_data: {
          name: item.name,
          images: [item.imageUrl], // Optional: Shows the product image on checkout
        },
        // Stripe expects amounts in the smallest currency unit (e.g., cents)
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity || 1,
    }));

    // Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // Return the session ID to the frontend
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}