// src/app/(shop)/layout.tsx
import Navbar from "@/app/(storefront)/components/Navbar";
import Footer from "@/app/(storefront)/components/Footer";

import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <CartProvider>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
      </CartProvider>
    </>
  );
}