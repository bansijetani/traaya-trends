import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

// GET: Fetch products for Inventory Table
export async function GET() {
  try {
    const products = await client.fetch(`
      *[_type == "product"] | order(title asc) {
        _id,
        name,
        "categoryName": category->title,
        price,
        sku,
        stockLevel,
        stockStatus,
        "imageUrl": images[0].asset->url
      }
    `);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching inventory" }, { status: 500 });
  }
}

// POST: Bulk Update Stock
export async function POST(req: Request) {
  try {
    const { updates } = await req.json(); // Array of { _id, stockLevel }
    
    // Sanity transaction to update multiple documents at once
    const transaction = client.transaction();
    
    updates.forEach((update: any) => {
      transaction.patch(update._id, {
        set: { 
            stockLevel: Number(update.stockLevel),
            // Auto-update status based on level
            stockStatus: Number(update.stockLevel) > 0 ? 'instock' : 'outstock' 
        }
      });
    });

    await transaction.commit();
    return NextResponse.json({ message: "Inventory updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error updating stock" }, { status: 500 });
  }
}