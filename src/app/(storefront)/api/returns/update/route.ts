import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
  apiVersion: "2023-01-01",
});

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    // Update the return request document in Sanity
    await client.patch(id).set({ status }).commit();

    return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update return status:", error);
    return NextResponse.json({ error: error.message || "Failed to update status" }, { status: 500 });
  }
}