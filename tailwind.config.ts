import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        traaya: {
          sand: "#F7F3EB",      // The Warm Beige Background
          terra: "#A85751",     // The Terracotta Red
          rose: "#E6B8B8",      // Rose Gold
          brown: "#4A3B32",     // Dark Brown Text
          dark: "#2C241F",      // Darker Brown Headings
          light: "#FFFFFF",     // Pure White
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)'],
        sans: ['var(--font-lato)'],
      },
    },
  },
  plugins: [],
};
export default config;