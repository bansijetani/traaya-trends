import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { userId, address, action, addressId } = await req.json();

    if (!userId) return NextResponse.json({ message: "Missing User ID" }, { status: 400 });

    // 1. Fetch current addresses
    const user = await client.fetch(`*[_type == "user" && _id == $userId][0]{ addresses }`, { userId });
    let currentAddresses = user?.addresses || [];

    // 2. Handle Actions
    if (action === "add") {
      const newAddress = {
        _key: crypto.randomUUID(),
        id: crypto.randomUUID(),
        ...address
      };

      // If new one is default, uncheck all others
      if (newAddress.isDefault) {
        currentAddresses = currentAddresses.map((a: any) => ({ ...a, isDefault: false }));
      }
      
      currentAddresses.push(newAddress);
    } 
    
    else if (action === "edit") {
      // Find and update the specific address
      currentAddresses = currentAddresses.map((a: any) => {
        if (a.id === address.id) {
            return { ...a, ...address }; // Update fields
        }
        // If the edited one is now default, uncheck this one
        if (address.isDefault) {
            return { ...a, isDefault: false };
        }
        return a;
      });
    }

    else if (action === "delete") {
      currentAddresses = currentAddresses.filter((a: any) => a.id !== addressId);
    }

    // 3. Save the clean array back to Sanity
    await client.patch(userId).set({ addresses: currentAddresses }).commit();

    return NextResponse.json({ message: "Success", addresses: currentAddresses });

  } catch (error) {
    console.error("Address API Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}