import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();

    // 1. Fetch Order to get Items and Previous Status
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        status,
        items[]{
          quantity,
          product->{_id}
        }
      }`, 
      { orderId }
    );

    const previousStatus = order.status;
    
    // If status isn't actually changing, do nothing
    if (previousStatus === status) {
        return NextResponse.json({ message: "Status is already set to " + status });
    }

    const transaction = client.transaction();

    // 2. Update the Status
    transaction.patch(orderId, (p) => p.set({ status: status }));

    // 3. LOGIC A: Admin is CANCELLING the order
    // Action: Add items BACK to stock (+)
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
        order.items.forEach((item: any) => {
            if (item.product?._id) {
                transaction.patch(item.product._id, (p) => 
                    p.inc({ stockLevel: item.quantity })
                );
            }
        });
    }

    // 4. LOGIC B: Admin is UN-CANCELLING (Re-activating) the order
    // Action: Remove items FROM stock again (-)
    else if (previousStatus === 'cancelled' && status !== 'cancelled') {
        order.items.forEach((item: any) => {
            if (item.product?._id) {
                transaction.patch(item.product._id, (p) => 
                    p.dec({ stockLevel: item.quantity })
                );
            }
        });
    }

    await transaction.commit();

    return NextResponse.json({ 
        message: "Status updated & Inventory adjusted", 
        status: status 
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Error updating status", error: error.message }, { status: 500 });
  }
}