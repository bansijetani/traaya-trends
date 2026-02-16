import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers"; // Auth/Session provider only
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", });

export const metadata: Metadata = {
  metadataBase: new URL("https://traaya-trends.vercel.app"),

  title: {
    template: "%s | Traaya Trends", // Automatically adds brand name to child pages
    default: "Traaya Trends | Modern & Trending Jewelry", // Fallback title
  },
  description: "Discover the latest in modern jewelry. Shop high-quality sculptural silver, baroque pearls, and trending accessories at Traaya Trends.",
  keywords: ["jewelry", "silver jewelry", "baroque pearls", "trending accessories", "Traaya Trends"],
  openGraph: {
    title: "Traaya Trends | Modern & Trending Jewelry",
    description: "Discover the latest in modern jewelry. Shop high-quality sculptural silver, baroque pearls, and trending accessories.",
    url: "https://traaya-trends.vercel.app", // Your live URL
    siteName: "Traaya Trends",
    images: [
      {
        url: "/og-image.jpg", // Create a cool brand image and put it in your /public folder
        width: 1200,
        height: 630,
        alt: "Traaya Trends Jewelry Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traaya Trends | Modern Jewelry",
    description: "Shop high-quality sculptural silver, baroque pearls, and trending accessories.",
  },
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
        {/* 👇 2. GOOGLE ANALYTICS NON-BLOCKING SCRIPTS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-TRACKING-ID"
          strategy="afterInteractive" // Loads right after the page is usable!
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YOUR-TRACKING-ID', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}