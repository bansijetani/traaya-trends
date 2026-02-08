import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
  console.log("👉 Signup API triggered"); // Debug Log

  try {
    const { name, email, password } = await req.json();
    console.log("👉 Attempting to register:", email); // Debug Log

    // 1. Check if user exists
    const userExists = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
    if (userExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomUUID();

    // 3. Create User
    const newUser = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "customer",
      isVerified: false,       
      verificationToken: token 
    });
    console.log("👉 User created in Sanity ID:", newUser._id); // Debug Log

    // 4. Generate Link
    // IMPORTANT: Based on your screenshot, your verify file is in 'api/verify', NOT 'api/auth/verify'
    // So we must match that path:
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;

    console.log("👉 Generated Link:", verifyLink); // Debug Log

    // 5. Send Email
    const emailHtml = generateEmailHtml({
        subject: "Welcome! Please Verify Your Email",
        greeting: name.split(' ')[0],
        message: "Welcome to Traaya Trends! Please verify your email address to secure your account.",
        buttonText: "Verify Account",
        buttonUrl: verifyLink
    });

    console.log("👉 Sending email via Resend..."); // Debug Log

    const emailData = await resend.emails.send({
        from: 'Traaya Trends <orders@traayatrends.com>', 
        to: email, 
        subject: "Verify your email",
        html: emailHtml
    });

    console.log("👉 Resend Response:", emailData); // Check if ID is returned or error

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Signup Error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}