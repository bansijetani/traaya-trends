import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  style: ['normal', 'italic'],
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"], 
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vemus Clone",
  description: "Luxury Jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jost.variable} font-sans antialiased bg-vemus-bg text-vemus-black`}>
        {children}
      </body>
    </html>
  );
}