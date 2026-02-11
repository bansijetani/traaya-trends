import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; // Auth/Session provider only
import ThemeProvider from "@/components/ThemeProvider";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-page text-primary`}>
        <Providers>
          <ThemeProvider>
            
            {children}
            
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}