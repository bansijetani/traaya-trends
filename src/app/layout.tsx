import type { Metadata } from "next";
// Using Jost instead of Lato to match the reference better
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
});

const jost = Jost({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"], 
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vemus Jewelry Clone",
  description: "Luxury E-commerce Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jost.variable} font-sans antialiased bg-white text-vemus-black`}>
        {children}
      </body>
    </html>
  );
}