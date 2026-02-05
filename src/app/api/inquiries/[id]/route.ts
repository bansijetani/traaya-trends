import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Type definition for Next.js 15 Params
type Params = Promise<{ id: string }>;

// 1. DELETE: Remove message
export async function DELETE(req: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    await client.delete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}

// 2. PATCH: Update Status (Mark Read)
export async function PATCH(req: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const body = await req.json();
    await client.patch(params.id).set({ status: body.status }).commit();
    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

// 3. POST: Send Reply (NEW!)
export async function POST(req: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const { email, subject, replyMessage } = await req.json();

    // A. Send Email (Keep this part same)
    await resend.emails.send({
      from: 'Traaya Support <onboarding@resend.dev>',
      to: email,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <p>${replyMessage.replace(/\n/g, "<br>")}</p>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">Traaya Trends Customer Support</p>
        </div>
      `,
    });

    // B. Update Sanity (👇 UPDATED LOGIC)
    await client.patch(params.id).set({ 
        status: 'replied',
        replyMessage: replyMessage,        // Save the text
        repliedAt: new Date().toISOString() // Save the time
    }).commit();

    return NextResponse.json({ message: "Reply sent successfully" });

  } catch (error) {
    console.error("Reply Error:", error);
    return NextResponse.json({ message: "Failed to send reply" }, { status: 500 });
  }
}