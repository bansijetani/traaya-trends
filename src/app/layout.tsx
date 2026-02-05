import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Providers } from "@/components/providers";
import ThemeProvider from "@/components/ThemeProvider";

// 👇 IMPORT TOASTER
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Tyaara Trends",
  description: "Luxury Jewelry Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider>
            <CartProvider>
              
              {children}

              {/* 👇 THIS IS REQUIRED FOR THE POPUP TO SHOW */}
              <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />

            </CartProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}