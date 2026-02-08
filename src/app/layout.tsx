import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

// 👇 Import Sanity Client to fetch colors
import { client } from "@/sanity/lib/client";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Tyaara Trends",
  description: "Luxury Jewelry Store",
};

// 👇 1. Fetch Theme Settings from Sanity
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
  // 👇 2. Get Data
  const settings = await getThemeSettings();

  // 👇 3. Create CSS Variable Object with Fallbacks
  const themeVariables = {
    "--primary-color": settings?.primaryColor || "#1A1A1A",
    "--secondary-color": settings?.secondaryColor || "#B87E58",
    "--background-color": settings?.backgroundColor || "#FFFFFF",
  } as React.CSSProperties;

  return (
    <html lang="en">
      {/* 👇 4. Apply Variables & Tailwind Classes to Body */}
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-page text-primary`}
        style={themeVariables}
      >
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