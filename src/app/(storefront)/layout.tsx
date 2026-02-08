// src/app/(shop)/layout.tsx
import Navbar from "@/app/(storefront)/components/Navbar";
import Footer from "@/app/(storefront)/components/Footer";



export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
    </>
  );
}