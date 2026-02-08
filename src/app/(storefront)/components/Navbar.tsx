import { client } from "@/sanity/lib/client";
import NavbarClient from "../../../components/NavbarClient";

async function getNavbarData() {
  // 👇 DEBUG QUERY: Fetch ALL navigation items to check their IDs
  const query = `{
    "logo": *[_type == "settings"][0].logo,
    "debugMenus": *[_type == "navigation"] {
      title,
      "slug": menuId.current,
      items
    }
  }`;
  
  return await client.fetch(query);
}

export default async function Navbar() {
  const data = await getNavbarData();

  // Try to find the menu that has items, regardless of slug
  const foundMenu = data.debugMenus.find((m: any) => m.items?.length > 0);

  const safeData = {
    logo: data?.logo || null,
    menuItems: foundMenu?.items || [] 
  };

  return <NavbarClient data={safeData} />;
}