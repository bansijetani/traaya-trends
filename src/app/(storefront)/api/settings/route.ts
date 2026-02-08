export const dynamic = "force-dynamic"; // 👈 CRITICAL: Disables Server Caching

import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(storefront)/api/auth/[...nextauth]/route";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // 👈 CRITICAL: Forces fresh data from Sanity
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function GET() {
  try {
    const data = await client.fetch(`*[_type == "settings"][0]{
      siteName,
      primaryColor,
      secondaryColor,
      backgroundColor,
      "logoUrl": logo.asset->url
    }`);

    // Return defaults if Sanity returns null
    return NextResponse.json(data || {
        siteName: "",
        primaryColor: "#1A1A1A",
        secondaryColor: "#B87E58",
        backgroundColor: "#FFFFFF"
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const siteName = formData.get("siteName") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const secondaryColor = formData.get("secondaryColor") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const logoFile = formData.get("logo") as File | null;

    // 1. Get existing ID or create new
    const existingSettings = await client.fetch(`*[_type == "settings"][0]._id`);
    
    let patch: any = {
      siteName,
      primaryColor,
      secondaryColor,
      backgroundColor,
    };

    // 2. Upload Logo if changed
    if (logoFile && logoFile.size > 0) {
      const imageAsset = await client.assets.upload('image', logoFile);
      patch.logo = {
        _type: 'image',
        asset: { _type: "reference", _ref: imageAsset._id }
      };
    }

    if (existingSettings) {
      await client.patch(existingSettings).set(patch).commit();
    } else {
      await client.create({ _type: "settings", ...patch });
    }

    return NextResponse.json({ message: "Settings updated" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error saving settings" }, { status: 500 });
  }
}