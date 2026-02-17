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
    
    // 👇 1. Pull out BOTH possible array names (cartItems and items)
    const { 
        firstName, lastName, email, address, city, zip, phone, 
        cartItems, items, couponCode, discount, total 
    } = body;

    // 👇 2. SAFETY CHECK: Use whichever one exists, fallback to empty array
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
      
      // 👇 3. Use safeItems here!
      items: safeItems.map((item: any) => ({
        _type: 'object', 
        _key: crypto.randomUUID(), 
        product: { _type: 'reference', _ref: item._id }, 
        quantity: item.quantity,
        price: item.price,
        productName: item.name,
        selectedSize: item.selectedSize || null,         
        selectedMaterial: item.selectedMaterial || null, 
        selectedColor: item.selectedColor || null,
        image: item.image || null        
      }))
    };

    transaction.create(orderObject);
    
    // 2. Deduct Stock
    // 👇 4. Use safeItems here too!
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
                from: 'Traaya Trends <onboarding@resend.dev>', 
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