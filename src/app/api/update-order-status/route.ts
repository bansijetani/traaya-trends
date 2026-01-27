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
    const { orderId, status } = await req.json();

    // 1. Log the attempt
    console.log(`Attempting to update Order ID: ${orderId} to Status: ${status}`);

    // 2. Perform the update
    const result = await client
      .patch(orderId)
      .set({ status: status })
      .commit();

    // 3. Log success
    console.log("Sanity Update Success:", result);

    return NextResponse.json({ message: "Status updated", data: result }, { status: 200 });

  } catch (error: any) {
    // 4. Log the EXACT error
    console.error("🔥 SANITY UPDATE ERROR:", error);

    // Return the error details to the frontend so we can see it there too
    return NextResponse.json({ 
      message: "Error updating status", 
      error: error.message 
    }, { status: 500 });
  }
}