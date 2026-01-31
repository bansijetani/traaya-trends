import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    
    // Extract Fields
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = Number(formData.get("price"));
    const salePrice = formData.get("salePrice") ? Number(formData.get("salePrice")) : null;
    const description = formData.get("description") as string;
    
    // 👇 NEW FIELDS
    const sku = formData.get("sku") as string;
    const stockLevel = Number(formData.get("stockLevel")) || 0;

    const categories = formData.getAll("categories") as string[];
    const imageFile = formData.get("image") as File; // Required
    const galleryFiles = formData.getAll("gallery") as File[];

    // 1. Upload Main Image
    const imageAsset = await client.assets.upload("image", imageFile);

    // 2. Upload Gallery Images
    const galleryAssets = await Promise.all(
      galleryFiles.map((file) => client.assets.upload("image", file))
    );

    // 3. Create Document
    await client.create({
      _type: "product",
      name,
      slug: { _type: "slug", current: slug },
      price,
      salePrice,
      description,
      sku,        // Saving SKU
      stockLevel, // Saving Stock
      categories: categories.map((id) => ({
        _type: "reference",
        _ref: id,
        _key: id,
      })),
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      gallery: galleryAssets.map((asset) => ({
        _type: "image",
        _key: asset._id,
        asset: { _type: "reference", _ref: asset._id },
      })),
      addedBy: session.user?.email || "Admin", // Track who added it
    });

    return NextResponse.json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}