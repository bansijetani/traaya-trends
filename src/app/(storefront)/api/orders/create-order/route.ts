import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml, generateAdminEmailHtml } from "@/lib/email-template"; 

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
  apiVersion: "2023-01-01",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN) {
        console.error("🔥 Missing SANITY_API_TOKEN in .env.local");
        return NextResponse.json({ message: "Server Error: Missing API Token" }, { status: 500 });
    }

    const body = await req.json();
    
    // Pull out all data from the request body
    const { 
        firstName, lastName, email, address, city, zip, phone, 
        cartItems, items, couponCode, discount, total 
    } = body;

    // SAFETY CHECK: Use whichever array exists
    const safeItems = cartItems || items || [];

    if (safeItems.length === 0) {
        throw new Error("No items were sent to the order API.");
    }

    // --- A. VALIDATE COUPON ---
    if (couponCode) {
        const coupon = await client.fetch(
            `*[_type == "coupon" && code == $code][0]`, 
            { code: couponCode.toUpperCase() }
        );

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ message: "Invalid or Inactive Coupon" }, { status: 400 });
        }
        if (coupon.usedBy && coupon.usedBy.includes(email)) {
            return NextResponse.json({ message: "Coupon already used by this email" }, { status: 400 });
        }
    }

    // --- B. PREPARE SANITY TRANSACTION ---
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const transaction = client.transaction();

    // 1. Create Order Document (FIXED TO MATCH SCHEMA EXACTLY)
    const orderObject = {
      _type: 'order',
      orderNumber: orderNumber,
      orderDate: new Date().toISOString(),
      
      // Matched exactly to your schema fields
      firstName: firstName, 
      lastName: lastName,
      email: email,
      phone: phone,
      address: address, 
      city: city,
      zipCode: zip,
      total: total,
      discount: Number(discount) || 0, 
      couponCode: couponCode || null,
      status: 'pending',
      
      // Matched exactly to your items array schema
      items: safeItems.map((item: any) => ({
        _key: crypto.randomUUID(), 
        name: item.name,          // FIXED: Was productName
        quantity: item.quantity,
        price: item.price,
        image: item.image || null // Make sure your frontend cart passes the image URL string here
      }))
    };

    transaction.create(orderObject);
    
    // 2. Deduct Stock
    safeItems.forEach((item: any) => {
        if (item._id) {
            transaction.patch(item._id, (p) => p.dec({ stockLevel: item.quantity }));
        }
    });

    // 3. Burn Coupon (Mark as used)
    if (couponCode) {
        const couponQuery = `*[_type == "coupon" && code == $code][0]._id`;
        const couponId = await client.fetch(couponQuery, { code: couponCode.toUpperCase() });

        if (couponId) {
            transaction.patch(couponId, (p) => 
                p.setIfMissing({ usedBy: [] }).append('usedBy', [email])
            );
        }
    }

    // --- C. COMMIT TRANSACTION ---
    const result = await transaction.commit();
    console.log("✅ Order Created in Sanity:", result.transactionId);

    // --- D. SEND EMAILS (RESEND) ---
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://traayatrends.vercel.app";

        if (generateEmailHtml) {
            const emailHtml = generateEmailHtml({
                subject: `Order Confirmed: ${orderNumber}`,
                greeting: firstName,
                message: `Thank you for your purchase! We have received your order and are getting it ready for shipment.\n\nOrder Total: $${(total || 0).toLocaleString()}`,
                buttonText: "View Your Receipt",
                buttonUrl: `${baseUrl}/order-success?orderNumber=${orderNumber}`
            });

            await resend.emails.send({
                from: 'Traaya Trends <support@traayatrends.com>', 
                to: email,
                subject: `Order Confirmed: ${orderNumber}`,
                html: emailHtml,
            });
        }

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
                        items: safeItems, // Pass safeItems so admin email doesn't break
                        shippingAddress: `${address}, ${city}, ${zip}`
                    }
                });

                await resend.emails.send({
                    from: 'Traaya Trends <support@traayatrends.com>',
                    to: adminEmails, 
                    subject: `💰 New Order: ${orderNumber} - $${total}`,
                    html: adminHtml
                });
            }
        }

    } catch (emailError) {
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