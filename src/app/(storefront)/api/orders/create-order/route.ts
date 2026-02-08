import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml, generateAdminEmailHtml } from "@/lib/email-template";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Important: False ensures we get the latest data (new admins)
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

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

    // --- D. SEND EMAILS (DYNAMIC ADMINS) ---
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://traayatrends.vercel.app";

        // 1. Send Customer Receipt (To the buyer)
        const emailHtml = generateEmailHtml({
            subject: `Order Confirmed: ${orderNumber}`,
            greeting: firstName,
            message: `Thank you for your purchase! We have received your order and are getting it ready for shipment.\n\nOrder Total: $${total.toLocaleString()}`,
            buttonText: "View Your Receipt",
            buttonUrl: `${baseUrl}/order-success?orderNumber=${orderNumber}`
        });

        await resend.emails.send({
            from: 'Traaya Trends <onboarding@resend.dev>',
            to: email,
            subject: `Order Confirmed: ${orderNumber}`,
            html: emailHtml,
        });

        // 👇 2. FETCH ADMIN EMAILS DYNAMICALLY
        // Query: Find all users where role is "admin" and return just their email
        const adminEmails = await client.fetch<string[]>(
            `*[_type == "user" && role == "admin"].email`
        );

        if (adminEmails.length > 0) {
            const adminHtml = generateAdminEmailHtml({
                orderDetails: {
                    orderNumber,
                    customerName: `${firstName} ${lastName}`,
                    totalAmount: total,
                    items: cartItems, 
                    shippingAddress: `${address}, ${city}, ${zip}`
                }
            });

            // Send to ALL admins found
            await resend.emails.send({
                from: 'Traaya Trends <onboarding@resend.dev>',
                to: adminEmails, // 👈 Resend accepts an array of strings here!
                subject: `💰 New Order: ${orderNumber} - $${total}`,
                html: adminHtml
            });
            
            console.log(`Admin alert sent to ${adminEmails.length} admins:`, adminEmails);
        } else {
            console.warn("⚠️ No admins found to notify! Please set role='admin' for a user in Sanity.");
        }

    } catch (emailError) {
        console.error("Failed to send email:", emailError);
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