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
    const { name, email, subject, message } = await req.json();

    // 1. Save to Sanity
    await client.create({
        _type: 'contact',
        name,
        email,
        subject,
        message,
        status: 'new'
    });

    // 2. Send Admin Alert
    // Update this to your real admin email if different
    const adminEmail = 'bansijetani22@gmail.com'; 

    await resend.emails.send({
        from: 'Traaya Contact <onboarding@resend.dev>',
        to: adminEmail,
        replyTo: email, // 👈 FIX: Changed from reply_to to replyTo
        subject: `📩 New Message: ${subject || 'Support Request'}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr />
                <p style="white-space: pre-wrap;">${message}</p>
                <hr />
                <p style="color: #888; font-size: 12px;">This message was saved to your Sanity Dashboard.</p>
            </div>
        `
    });

    return NextResponse.json({ message: "Message sent successfully" });

  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}