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
    const currentUser = session?.user?.name || session?.user?.email || "Unknown";

    const formData = await req.formData();
    
    const productId = formData.get("productId") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = parseFloat(formData.get("price") as string);
    const salePriceRaw = formData.get("salePrice") as string;
    const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
    const description = formData.get("description") as string;

    // 👇 1. Get Multiple Categories
    const categoryIds = formData.getAll("categories") as string[];

    const imageFile = formData.get("image") as File | null;
    const galleryFiles = formData.getAll("gallery") as File[];

    if (!productId) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    // 2. Start Patch
    let patch = client.patch(productId).set({
      name,
      slug: { _type: "slug", current: slug },
      price,
      salePrice: salePrice ?? undefined,
      description,
      addedBy: currentUser,
      // 3. Update Categories Reference Array
      categories: categoryIds.map(id => ({
        _type: 'reference',
        _ref: id
      }))
    });

    // 4. Handle Featured Image
    if (imageFile && imageFile.size > 0) {
      console.log("Updating featured image...");
      const imageAsset = await client.assets.upload('image', imageFile, {
        contentType: imageFile.type,
        filename: imageFile.name,
      });
      patch = patch.set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        },
      });
    }

    // 5. Handle Gallery (Append new images)
    if (galleryFiles.length > 0) {
      console.log(`Appending ${galleryFiles.length} images to gallery...`);
      const newGalleryAssets = await Promise.all(
        galleryFiles.map(async (file) => {
          const asset = await client.assets.upload('image', file, {
            contentType: file.type,
            filename: file.name,
          });
          return {
            _type: "image",
            _key: asset._id,
            asset: { _type: "reference", _ref: asset._id },
          };
        })
      );
      patch = patch.setIfMissing({ gallery: [] }).append('gallery', newGalleryAssets);
    }

    const updatedProduct = await patch.commit();

    return NextResponse.json({ message: "Product updated", product: updatedProduct }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}