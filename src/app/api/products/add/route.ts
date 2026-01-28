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
    const formData = await req.formData();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized: You must be logged in." }, { status: 401 });
    }
    const currentUser = session.user?.name || session.user?.email || "Unknown";
    
    // Extract Basic Fields
    const name = formData.get("name") as string;
    const baseSlug = formData.get("slug") as string; // 👈 Get the requested slug
    const price = parseFloat(formData.get("price") as string);
    const salePriceRaw = formData.get("salePrice") as string;
    const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : undefined;
    const description = formData.get("description") as string;

    const categoryIds = formData.getAll("categories") as string[];

    // Extract Images
    const imageFile = formData.get("image") as File;
    const galleryFiles = formData.getAll("gallery") as File[];

    if (!name || !baseSlug || !imageFile) {
      return NextResponse.json({ message: "Name, Slug, and Featured Image are required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 🔍 SLUG UNIQUENESS CHECK
    // ---------------------------------------------------------
    let finalSlug = baseSlug;
    let counter = 1;

    // Loop until we find a slug that DOES NOT exist
    while (true) {
      const existingProduct = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]._id`,
        { slug: finalSlug }
      );

      if (!existingProduct) {
        break; // Slug is unique! Exit loop.
      }

      // If exists, append number (e.g., "gold-ring" -> "gold-ring-1")
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    // ---------------------------------------------------------

    // 1. Upload Featured Image
    console.log("Uploading featured image...");
    const imageAsset = await client.assets.upload('image', imageFile, {
      contentType: imageFile.type,
      filename: imageFile.name,
    });

    // 2. Upload Gallery Images
    console.log(`Uploading ${galleryFiles.length} gallery images...`);
    const galleryAssets = await Promise.all(
      galleryFiles.map(async (file) => {
        const asset = await client.assets.upload('image', file, {
          contentType: file.type,
          filename: file.name,
        });
        return {
          _type: "image",
          _key: asset._id,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        };
      })
    );

    // 3. Create Product (Using finalSlug)
    console.log(`Saving product with slug: ${finalSlug}`);
    const newProduct = await client.create({
      _type: "product",
      name,
      slug: { _type: "slug", current: finalSlug }, // 👈 Save the unique slug
      price,
      salePrice,
      categories: categoryIds.map((id) => ({
        _type: 'reference',
        _ref: id,
      })),
      description,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      },
      addedBy: currentUser,
      gallery: galleryAssets,
    });

    return NextResponse.json({ message: "Success", product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json({ message: "Error saving product" }, { status: 500 });
  }
}