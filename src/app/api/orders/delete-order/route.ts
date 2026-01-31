import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Requires Editor Token
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "Missing Order ID" }, { status: 400 });
    }

    await client.delete(orderId);

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Order Error:", error);
    return NextResponse.json({ message: "Error deleting order" }, { status: 500 });
  }
}