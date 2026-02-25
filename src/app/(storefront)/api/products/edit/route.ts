import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(storefront)/api/auth/[...nextauth]/route";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    // 1. Extract Fields
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = Number(formData.get("price"));
    const salePrice = formData.get("salePrice") ? Number(formData.get("salePrice")) : null;
    const description = formData.get("description") as string;
    const additionalInfo = formData.get("additionalInfo") as string;
    const sku = formData.get("sku") as string;
    const stockLevel = Number(formData.get("stockLevel"));
    const categories = formData.getAll("categories") as string[];
    const tags = formData.getAll("tags") as string[];

    // 📸 IMAGE FIELDS
    const imageFile = formData.get("image") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];
    
    // 🗑️ NEW: Get the list of existing gallery image IDs/references that we want to KEEP
    // In your frontend, send these as 'existingGalleryIds'
    const existingGalleryJson = formData.get("existingGallery") as string; 
    const existingGallery = existingGalleryJson ? JSON.parse(existingGalleryJson) : [];

    // 2. Prepare the update object
    const updates: any = {
      name,
      slug: { _type: "slug", current: slug },
      price,
      salePrice,
      description,
      additionalInfo,
      sku,
      stockLevel,
      tags,
      categories: categories.map((catId) => ({
        _type: "reference",
        _ref: catId,
        _key: catId,
      })),
    };

    // 3. Handle Featured Image Removal/Update
    // If imageFile is explicitly 'null' or empty in your logic, you can unset it.
    if (imageFile && imageFile.size > 0) {
      const imageAsset = await client.assets.upload("image", imageFile);
      updates.image = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      };
    }

    // 4. Build the NEW Gallery array (Existing kept items + New uploads)
    let finalGallery = existingGallery.map((img: any) => ({
        _type: 'image',
        _key: img._key || Math.random().toString(36).substring(7),
        asset: { _type: 'reference', _ref: img.asset?._ref || img.asset?._id }
    }));

    if (galleryFiles.length > 0) {
        const galleryAssets = await Promise.all(
            galleryFiles.map(file => client.assets.upload("image", file))
        );
        const newGalleryObjects = galleryAssets.map(asset => ({
            _type: 'image',
            _key: asset._id,
            asset: { _type: 'reference', _ref: asset._id }
        }));
        finalGallery = [...finalGallery, ...newGalleryObjects];
    }

    // Overwrite the gallery field with the new combined/filtered list
    updates.gallery = finalGallery;

    // 5. Execute the Update
    // Using .set() overwrites the fields, effectively "removing" anything not in the 'updates' object
    await client.patch(productId).set(updates).commit();

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    // Return specific error message for permission issues seen in console
    if (error instanceof Error && error.message.includes("permissions")) {
        return NextResponse.json({ message: "Sanity Token has insufficient permissions." }, { status: 403 });
    }
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}