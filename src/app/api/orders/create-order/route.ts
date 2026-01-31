import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml } from "@/lib/email-template";

// 1. Init Sanity Client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

// 2. Init Resend (Email Service)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
        firstName, lastName, email, address, city, zip, phone, 
        cartItems, couponCode, discount, total 
    } = body;

    // --- A. VALIDATE COUPON ---
    if (couponCode) {
        const coupon = await client.fetch(
            `*[_type == "coupon" && code == $code][0]`, 
            { code: couponCode.toUpperCase() }
        );

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ message: "Invalid Coupon" }, { status: 400 });
        }
        if (coupon.usedBy && coupon.usedBy.includes(email)) {
            return NextResponse.json({ message: "Coupon already used by this email" }, { status: 400 });
        }
    }

    // --- B. CREATE ORDER IN SANITY ---
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderObject = {
      _type: 'order',
      orderNumber: orderNumber,
      orderDate: new Date().toISOString(),
      customerName: `${firstName} ${lastName}`, 
      email: email,
      phone: phone,
      shippingAddress: `${address}, ${city}, ${zip}`, 
      totalPrice: total,
      discount: Number(discount) || 0, 
      couponCode: couponCode,
      status: 'pending',
      items: cartItems.map((item: any) => ({
        _type: 'object',
        _key: item.id, 
        product: { _type: 'reference', _ref: item.id }, 
        quantity: item.quantity,
        price: item.price
      }))
    };

    const transaction = client.transaction();
    transaction.create(orderObject);
    
    cartItems.forEach((item: any) => {
        transaction.patch(item.id, (p) => p.dec({ stockLevel: item.quantity }));
    });

    const result = await transaction.commit();

    // --- C. BURN COUPON ---
    if (couponCode) {
        const coupon = await client.fetch(`*[_type == "coupon" && code == $code][0]`, { code: couponCode.toUpperCase() });
        if (coupon) {
            await client.patch(coupon._id)
                .setIfMissing({ usedBy: [] })
                .append('usedBy', [email])
                .commit();
        }
    }

    // --- D. SEND CONFIRMATION EMAIL (NEW!) ---
    try {
          const emailHtml = generateEmailHtml({
            subject: `Order Confirmed: ${orderNumber}`,
            greeting: firstName, // Uses the customer's real name
            message: `Thank you for your purchase! We have received your order and are getting it ready for shipment.\n\nOrder Total: $${total.toLocaleString()}`,
            buttonText: "View Your Receipt",
            buttonUrl: `https://traayatrends.com/order-success?orderNumber=${orderNumber}`
          });

          await resend.emails.send({
            from: 'Traaya Trends <orders@traayatrends.com>',
            to: email,
            subject: `Order Confirmed: ${orderNumber}`,
            html: emailHtml, // 👈 Uses the beautiful design automatically
          });
        console.log("Email sent successfully to:", email);
    } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // We don't block the order if email fails, just log it
    }

    // --- E. RETURN SUCCESS ---
    return NextResponse.json({ 
        message: "Order created successfully", 
        orderId: result.transactionId,
        orderNumber: orderNumber 
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}