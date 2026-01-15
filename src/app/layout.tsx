import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700"], 
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Traaya Trends | The Poetry of Gold",
  description: "Modern Jewelry & Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased bg-traaya-sand text-traaya-brown`}>
        {children}
      </body>
    </html>
  );
} 