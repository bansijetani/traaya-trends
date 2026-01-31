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

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    // 1. Extract Basic Fields
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = Number(formData.get("price"));
    const salePrice = formData.get("salePrice") ? Number(formData.get("salePrice")) : null;
    const description = formData.get("description") as string;
    
    // 👇 2. EXTRACT NEW INVENTORY FIELDS (This was missing!)
    const sku = formData.get("sku") as string;
    const stockLevel = Number(formData.get("stockLevel"));

    const categories = formData.getAll("categories") as string[];
    const imageFile = formData.get("image") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];

    // 3. Prepare the update object
    const updates: any = {
      name,
      slug: { _type: "slug", current: slug },
      price,
      salePrice,
      description,
      sku,        // 👈 Saving SKU
      stockLevel, // 👈 Saving Stock
      categories: categories.map((catId) => ({
        _type: "reference",
        _ref: catId,
        _key: catId, // Adding key helps Sanity avoid conflicts
      })),
    };

    // 4. Handle Featured Image Update (Only if new one provided)
    if (imageFile && imageFile.size > 0) {
      const imageAsset = await client.assets.upload("image", imageFile);
      updates.image = {
        _type: "image",
        asset: { _type: "reference", _ref: imageAsset._id },
      };
    }

    // 5. Handle Gallery Update (Append new images to existing)
    if (galleryFiles.length > 0) {
        const galleryAssets = await Promise.all(
            galleryFiles.map(file => client.assets.upload("image", file))
        );
        
        // We use client.patch().setIfMissing().append() pattern usually, 
        // but here we are simplifying to just append to the list via the main patch if possible,
        // or we need a separate operation. To keep it simple in one go:
        // We will fetch existing, or just use `insert` in the patch below.
    }

    // 6. Execute the Update
    const patch = client.patch(productId).set(updates);

    // If there are new gallery images, append them
    if (galleryFiles.length > 0) {
         const galleryAssets = await Promise.all(
            galleryFiles.map(file => client.assets.upload("image", file))
        );
        const newGalleryObjects = galleryAssets.map(asset => ({
            _type: 'image',
            _key: asset._id,
            asset: { _type: 'reference', _ref: asset._id }
        }));
        // Append to end of gallery array
        patch.setIfMissing({ gallery: [] }).append('gallery', newGalleryObjects);
    }

    await patch.commit();

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}