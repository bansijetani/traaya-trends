import { NextResponse } from "next/server";
import { Resend } from 'resend';
import { generateEmailHtml } from "@/lib/email-template"; // Import the template

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, message, name, buttonText, buttonUrl } = body;

    if (!to || !subject || !message) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Generate the Beautiful HTML
    const emailHtml = generateEmailHtml({
        subject,
        greeting: name,          // Pass the customer name
        message: message,        // The main text
        buttonText: buttonText,  // Optional Button
        buttonUrl: buttonUrl     // Optional Link
    });

    await resend.emails.send({
      from: 'Traaya Trends <onboarding@resend.dev>', // Update to your real domain when verified
      to: to,
      subject: subject,
      html: emailHtml, // 👈 Use the template here
    });

    return NextResponse.json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}