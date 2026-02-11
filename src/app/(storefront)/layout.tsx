import Navbar from "@/app/(storefront)/components/Navbar";
import Footer from "@/app/(storefront)/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { client } from "@/sanity/lib/client";

// Fetch global settings (Logo, Menu) for the Navbar
async function getData() {
  try {
    const query = `*[_type == "settings"][0] {
      logo,
      menuItems
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const data = await getData();

  return (
    /* 1. PROVIDERS: We wrap ONLY the shop pages in these providers.
         This prevents them from running on the Sanity Admin pages.
    */
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
            
            {/* 2. UI ELEMENTS: Navbar and Cart Drawer */}
            {/* We pass the fetched data to Navbar */}
            <Navbar/>
            <CartDrawer />
            
            {/* 3. MAIN CONTENT */}
            <main className="min-h-screen">
                {children}
            </main>
            
            {/* 4. FOOTER */}
            <Footer />

        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}