import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-01-01",
});

// GET: Fetch categories WITH parent info
export async function GET() {
  try {
    const categories = await client.fetch(`*[_type == "category"] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      "imageUrl": image.asset->url,
      "parentId": parent._ref,
      "parentName": parent->name
    }`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Add new category
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const parentId = formData.get("parentId") as string; // 👈 Get Parent ID
    const imageFile = formData.get("image") as File | null;

    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    let imageAsset = undefined;
    if (imageFile && imageFile.size > 0) {
      const asset = await client.assets.upload('image', imageFile, {
        contentType: imageFile.type,
        filename: imageFile.name,
      });
      imageAsset = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    }

    const newCategory = await client.create({
      _type: "category",
      name,
      slug: { _type: "slug", current: name.toLowerCase().replace(/\s+/g, "-").slice(0, 96) },
      image: imageAsset,
      // 👇 Save Parent Reference if selected
      parent: parentId ? { _type: 'reference', _ref: parentId } : undefined 
    });

    return NextResponse.json({ message: "Category added", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

// PUT: Update category
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const parentId = formData.get("parentId") as string;
    const imageFile = formData.get("image") as File | null;
    const deleteImage = formData.get("deleteImage") === "true"; // 👈 Check for delete flag

    if (!id || !name) return NextResponse.json({ error: "ID and Name required" }, { status: 400 });

    let patch = client.patch(id).set({ 
        name,
        parent: parentId ? { _type: 'reference', _ref: parentId } : { _type: 'reference', _ref: undefined }
    });

    // 👇 LOGIC FOR IMAGE HANDLING
    if (deleteImage) {
      // User clicked "X" -> Remove image from database
      patch = patch.unset(['image']);
    } 
    else if (imageFile && imageFile.size > 0) {
      // User uploaded new image -> Upload and Replace
      const asset = await client.assets.upload('image', imageFile, {
        contentType: imageFile.type,
        filename: imageFile.name,
      });
      patch = patch.set({
        image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      });
    }

    await patch.commit();
    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
