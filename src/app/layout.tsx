import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import ThemeProvider from "@/components/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext"; // 👈 1. ADD THIS IMPORT
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/CartDrawer";

// Import Sanity Client to fetch colors
import { client } from "@/sanity/lib/client";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Tyaara Trends",
  description: "Luxury Jewelry Store",
};

// Fetch Theme Settings from Sanity
async function getThemeSettings() {
  const query = `*[_type == "settings"][0]{
    primaryColor,
    secondaryColor,
    backgroundColor
  }`;
  return await client.fetch(query);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get Data
  const settings = await getThemeSettings();

  // Create CSS Variable Object with Fallbacks
  const themeVariables = {
    "--primary-color": settings?.primaryColor || "#1A1A1A",
    "--secondary-color": settings?.secondaryColor || "#B87E58",
    "--background-color": settings?.backgroundColor || "#FFFFFF",
  } as React.CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply Variables & Tailwind Classes to Body */}
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-page text-primary`}
        style={themeVariables}
      >
        <Providers>
          <ThemeProvider>
            {/* 👇 2. WRAP CURRENCY PROVIDER HERE */}
            <CurrencyProvider>
              <CartProvider>
                <CartDrawer />
                {children}
                <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
              </CartProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}