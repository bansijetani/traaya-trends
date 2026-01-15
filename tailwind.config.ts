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
          sand: "#F7F3EB",      // Background
          terra: "#A85751",     // Accents/Buttons
          rose: "#E6B8B8",      // Soft details
          brown: "#4A3B32",     // Body Text
          dark: "#2C241F",      // Headings
          light: "#FFFFFF",     // Cards
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