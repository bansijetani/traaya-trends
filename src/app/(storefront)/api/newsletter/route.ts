import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 👇 REAL EMAIL LOGIC GOES HERE (e.g., Resend, Mailchimp)
    // ---------------------------------------------------------
    
    // For now, we LOG it to your terminal so you can verify it works.
    console.log("--------------------------------");
    console.log("🔔 NEW NEWSLETTER SUBSCRIBER:");
    console.log("📧 Email:", email);
    console.log("--------------------------------");

    // Example with Resend (if you install it later):
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to Traaya Trends!',
        html: '<p>Thank you for subscribing!</p>'
    });

    // ---------------------------------------------------------

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Newsletter Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}