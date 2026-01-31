import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Important for real-time stock updates
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    // 1. Read data from your Checkout Form
    const body = await req.json();
    const { 
        firstName, 
        lastName, 
        email, 
        address, 
        city, 
        zip, 
        phone, 
        cartItems, 
        couponCode,
        discount, 
        total 
    } = body;

    // 2. Validate Coupon (Before creating order)
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

    // 👇 NEW: Generate Order Number HERE so we can return it later
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Prepare Order Object
    const orderObject = {
      _type: 'order',
      orderNumber: orderNumber, // 👈 Use the variable we created above
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

    // 4. START SANITY TRANSACTION (Order + Stock Update)
    const transaction = client.transaction();

    // A. Create the Order
    transaction.create(orderObject);

    // B. Subtract Stock for every item in cart
    cartItems.forEach((item: any) => {
        transaction.patch(item.id, (p) => 
            p.dec({ stockLevel: item.quantity }) 
        );
    });

    // 5. Commit (Save) Order & Stock
    const result = await transaction.commit();

    // 6. BURN COUPON (Only if order succeeded)
    if (couponCode) {
        const coupon = await client.fetch(`*[_type == "coupon" && code == $code][0]`, { code: couponCode.toUpperCase() });
        if (coupon) {
            await client.patch(coupon._id)
                .setIfMissing({ usedBy: [] })
                .append('usedBy', [email])
                .commit();
        }
    }

    // 👇 RETURN THE ORDER NUMBER so the frontend can redirect correctly
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