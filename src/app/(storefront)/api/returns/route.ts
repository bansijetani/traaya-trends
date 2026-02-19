import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
  apiVersion: "2023-01-01",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Extract text fields
    const orderId = formData.get("orderId") as string;
    const productName = formData.get("productName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const reason = formData.get("reason") as string;
    const message = formData.get("message") as string;
    
    // 2. Extract and Upload File (if exists)
    const file = formData.get("file") as File | null;
    let sanityFileAsset = null;

    if (file && file.size > 0) {
      // Convert file to buffer for Sanity upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Sanity Assets
      sanityFileAsset = await client.assets.upload('file', buffer, {
        filename: file.name,
        contentType: file.type
      });
    }

    // 3. Save to Sanity Database
    const returnDoc = {
      _type: 'returnRequest',
      orderNumber: orderId,
      productName: productName,
      email: email,
      phone: phone,
      reason: reason,
      message: message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      // Attach file reference if uploaded
      ...(sanityFileAsset && {
        proofFile: {
          _type: 'file',
          asset: { _type: 'reference', _ref: sanityFileAsset._id }
        }
      })
    };

    await client.create(returnDoc);

    // 4. Send Email Notification to Admin
    const adminEmails = await client.fetch<string[]>(`*[_type == "user" && role == "admin"].email`);
    
    if (adminEmails && adminEmails.length > 0) {
      await resend.emails.send({
        from: 'Traaya Trends <support@traayatrends.com>',
        to: adminEmails,
        subject: `⚠️ New Return Request: ${orderId}`,
        html: `
          <h2>New Return Request</h2>
          <p><strong>Order:</strong> ${orderId}</p>
          <p><strong>Item:</strong> ${productName}</p>
          <p><strong>Customer:</strong> ${email} | ${phone}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Message:</strong> ${message || 'No additional comments.'}</p>
          <br/>
          <p>Log in to your Sanity Admin Panel to view the request and the uploaded proof video/image.</p>
        `
      });
    }

    return NextResponse.json({ message: "Return submitted successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Return API Error:", error);
    return NextResponse.json({ message: error.message || "Failed to submit return" }, { status: 500 });
  }
}