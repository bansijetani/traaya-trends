import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Requires Editor/Write Token
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Check if user already exists
    const userExists = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
    if (userExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // 2. Hash the password (Securely)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User in Sanity
    const newUser = await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}