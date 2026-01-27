import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, address, city, zip, phone, cartItems, total } = data;

    const order = await client.create({
      _type: "order",
      firstName,
      lastName,
      email,
      address,
      city,
      zipCode: zip,
      phone,
      total: total,
      orderDate: new Date().toISOString(),
      status: "pending",
      orderNumber: `ORD-${Date.now()}`,
      items: cartItems.map((item: any) => ({
        _type: "object",
        _key: item._id || `key-${Math.random()}`, // 👈 ADDED THIS LINE (Generates a unique key)
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
    });

    return NextResponse.json({ message: "Order created successfully", order }, { status: 200 });

  } catch (error) {
    console.error("Error creating order in Sanity:", error);
    return NextResponse.json({ message: "Error creating order", error }, { status: 500 });
  }
}