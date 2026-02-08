import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml } from "@/lib/email-template";
import crypto from "crypto";

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
    const { email } = await req.json();

    // 1. Check if user exists
    const user = await client.fetch<any>(
        `*[_type == "user" && email == $email][0]`, 
        { email }
    );

    if (!user) {
        // Security: Don't reveal if email exists or not. Fake a success.
        return NextResponse.json({ message: "If that email exists, we sent a link." });
    }

    // 2. Generate Token & Expiry (1 Hour from now)
    const token = crypto.randomUUID();
    const expiry = Date.now() + 3600000; // 1 hour in milliseconds

    // 3. Save to Sanity
    await client.patch(user._id)
        .set({ 
            resetToken: token, 
            resetTokenExpiry: expiry 
        })
        .commit();

    // 4. Generate Link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // 5. Send Email
    const emailHtml = generateEmailHtml({
        subject: "Reset Your Password - Traaya Trends",
        greeting: user.name.split(' ')[0],
        message: "We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.",
        buttonText: "Reset Password",
        buttonUrl: resetLink
    });

    await resend.emails.send({
        from: 'Traaya Trends <orders@traayatrends.com>', // Update to real domain later
        to: email,
        subject: "Reset Your Password",
        html: emailHtml
    });

    return NextResponse.json({ message: "Email sent" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}