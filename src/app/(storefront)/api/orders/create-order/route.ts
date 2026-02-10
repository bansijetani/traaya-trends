import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
// Ensure these imports match your actual file structure
import { generateEmailHtml, generateAdminEmailHtml } from "@/lib/email-template"; 

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Important: False ensures we get the latest data
  token: process.env.SANITY_API_TOKEN, // 👈 REQUIRED for writing data
  apiVersion: "2023-01-01",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. CRITICAL: Check for Write Token
    if (!process.env.SANITY_API_TOKEN) {
        console.error("🔥 Missing SANITY_API_TOKEN in .env.local");
        return NextResponse.json({ message: "Server Error: Missing API Token" }, { status: 500 });
    }

    const body = await req.json();
    const { 
        firstName, lastName, email, address, city, zip, phone, 
        cartItems, couponCode, discount, total 
    } = body;

    // --- A. VALIDATE COUPON ---
    if (couponCode) {
        // Fetch coupon to ensure it's valid before processing order
        const coupon = await client.fetch(
            `*[_type == "coupon" && code == $code][0]`, 
            { code: couponCode.toUpperCase() }
        );

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ message: "Invalid or Inactive Coupon" }, { status: 400 });
        }
        // Check if user already used this coupon (if your schema tracks usage)
        if (coupon.usedBy && coupon.usedBy.includes(email)) {
            return NextResponse.json({ message: "Coupon already used by this email" }, { status: 400 });
        }
    }

    // --- B. PREPARE SANITY TRANSACTION ---
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const transaction = client.transaction();

    // 1. Create Order Document
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
      couponCode: couponCode || null,
      status: 'pending',
      items: cartItems.map((item: any) => ({
        _type: 'object', // Or 'orderItem' depending on your schema
        _key: item._id, 
        // Create a reference to the product if it exists in Sanity
        product: { _type: 'reference', _ref: item._id }, 
        quantity: item.quantity,
        price: item.price,
        productName: item.name // Store name as string backup
      }))
    };

    transaction.create(orderObject);
    
    // 2. Deduct Stock (FIXED)
    cartItems.forEach((item: any) => {
        // 👇 CRITICAL FIX: Use item._id instead of item.id
        if (item._id) {
            // Ensure your schema uses 'stockLevel' or 'stock'. Change below if needed.
            transaction.patch(item._id, (p) => p.dec({ stockLevel: item.quantity }));
        }
    });

    // 3. Burn Coupon (Mark as used)
    if (couponCode) {
        // We need the coupon ID to patch it. We fetch it first.
        // Optimization: You could fetch this ID in step A and store it.
        // For now, let's look it up by code to be safe.
        const couponQuery = `*[_type == "coupon" && code == $code][0]._id`;
        const couponId = await client.fetch(couponQuery, { code: couponCode.toUpperCase() });

        if (couponId) {
            transaction.patch(couponId, (p) => 
                p.setIfMissing({ usedBy: [] }).append('usedBy', [email])
            );
        }
    }

    // --- C. COMMIT TRANSACTION ---
    // This executes Order Creation + Stock Update + Coupon Update atomically
    const result = await transaction.commit();

    console.log("✅ Order Created in Sanity:", result.transactionId);

    // --- D. SEND EMAILS (RESEND) ---
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://traayatrends.vercel.app";

        // 1. Customer Email
        if (generateEmailHtml) {
            const emailHtml = generateEmailHtml({
                subject: `Order Confirmed: ${orderNumber}`,
                greeting: firstName,
                message: `Thank you for your purchase! We have received your order and are getting it ready for shipment.\n\nOrder Total: $${total.toLocaleString()}`,
                buttonText: "View Your Receipt",
                buttonUrl: `${baseUrl}/order-success?orderNumber=${orderNumber}`
            });

            await resend.emails.send({
                from: 'Traaya Trends <onboarding@resend.dev>', // Change to your verified domain later
                to: email,
                subject: `Order Confirmed: ${orderNumber}`,
                html: emailHtml,
            });
        }

        // 2. Admin Emails
        if (generateAdminEmailHtml) {
            const adminEmails = await client.fetch<string[]>(
                `*[_type == "user" && role == "admin"].email`
            );

            if (adminEmails && adminEmails.length > 0) {
                const adminHtml = generateAdminEmailHtml({
                    orderDetails: {
                        orderNumber,
                        customerName: `${firstName} ${lastName}`,
                        totalAmount: total,
                        items: cartItems, 
                        shippingAddress: `${address}, ${city}, ${zip}`
                    }
                });

                await resend.emails.send({
                    from: 'Traaya Trends <onboarding@resend.dev>',
                    to: adminEmails, 
                    subject: `💰 New Order: ${orderNumber} - $${total}`,
                    html: adminHtml
                });
            }
        }

    } catch (emailError) {
        // Don't fail the order if emails fail, just log it
        console.error("⚠️ Failed to send email:", emailError);
    }

    // --- E. RETURN SUCCESS ---
    return NextResponse.json({ 
        message: "Order created successfully", 
        orderId: result.transactionId,
        orderNumber: orderNumber 
    }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Order Creation Error:", error);
    return NextResponse.json(
        { message: error.message || "Failed to create order" }, 
        { status: 500 }
    );
  }
}