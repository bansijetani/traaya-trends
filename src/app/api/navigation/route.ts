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

// GET: Fetch ALL menus
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
       // Fetch specific menu
       const menu = await client.fetch(`*[_type == "navigation" && _id == $id][0]`, { id });
       return NextResponse.json(menu || {});
    } else {
       // Fetch list of menus
       const menus = await client.fetch(`*[_type == "navigation"]|order(title asc){_id, title, menuId, items}`);
       return NextResponse.json(menus);
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// POST: Create or Update a Menu
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { _id, title, items } = body;

    // Generate a slug ID if missing
    const menuId = title.toLowerCase().replace(/\s+/g, '-');

    if (_id) {
      // UPDATE existing
      await client.patch(_id).set({ items, title }).commit();
    } else {
      // CREATE new
      await client.create({
        _type: "navigation",
        title,
        menuId: { current: menuId },
        items: items || []
      });
    }

    return NextResponse.json({ message: "Saved" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// DELETE: Remove a menu
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const { _id } = await req.json();
    await client.delete(_id);
    
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}