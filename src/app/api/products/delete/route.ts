import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // 👈 Must be Editor Token
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    await client.delete(productId);

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}