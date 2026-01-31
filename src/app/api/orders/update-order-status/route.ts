import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml } from "@/lib/email-template"; // 👈 Import Template

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();

    // 1. Fetch Order (Updated to get Email & Name)
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        status,
        email,          // 👈 Needed for email
        customerName,   // 👈 Needed for email
        orderNumber,    // 👈 Needed for email
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

    // 3. LOGIC A: Admin is CANCELLING the order (Add Stock +)
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
        order.items.forEach((item: any) => {
            if (item.product?._id) {
                transaction.patch(item.product._id, (p) => 
                    p.inc({ stockLevel: item.quantity })
                );
            }
        });
    }

    // 4. LOGIC B: Admin is UN-CANCELLING (Remove Stock -)
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

    // 5. 👇 NEW: SEND EMAIL NOTIFICATION (After update succeeds)
    if (order.email) {
        try {
            let subject = `Order Update: ${status}`;
            let message = `Your order status has been updated to: ${status}`;
            let buttonText = "View Order";

            // Customize message based on status
            if (status === 'shipped') {
                subject = "Your Order Has Shipped! 🚚";
                message = `Great news! Your order ${order.orderNumber} has been shipped and is on its way.`;
                buttonText = "Track Shipment";
            } else if (status === 'delivered') {
                subject = "Package Delivered 📦";
                message = `Your order ${order.orderNumber} has been marked as delivered. We hope you enjoy your purchase!`;
            } else if (status === 'cancelled') {
                subject = "Order Cancelled ❌";
                message = `Your order ${order.orderNumber} has been cancelled. If this was a mistake, please contact support.`;
            }

            // Generate HTML
            const emailHtml = generateEmailHtml({
                subject: subject,
                greeting: order.customerName ? order.customerName.split(' ')[0] : "Customer",
                message: message,
                buttonText: buttonText,
                buttonUrl: `https://traayatrends.com/order-success?orderNumber=${order.orderNumber}`
            });

            // Send Email
            await resend.emails.send({
                from: 'Traaya Trends <orders@traayatrends.com>',
                to: order.email,
                subject: subject,
                html: emailHtml
            });
            
            console.log(`Status email sent to ${order.email}`);
        } catch (emailError) {
            console.error("Failed to send status email:", emailError);
            // We do NOT return an error here, because the actual Order Update was successful.
            // We just log it so the admin knows the email didn't go out.
        }
    }

    return NextResponse.json({ 
        message: "Status updated & Inventory adjusted", 
        status: status 
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Error updating status", error: error.message }, { status: 500 });
  }
}