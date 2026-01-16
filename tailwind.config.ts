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
        // The "Vemus" Palette (White, Black, Gold)
        vemus: {
          gold: "#cda45e",   // The luxury accent color
          black: "#111111",  // Deep black text
          darkgray: "#333333", // Secondary text
          lightgray: "#f8f8f8", // Subtle background sections
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'], // For headings
        sans: ['var(--font-jost)', 'sans-serif'],     // For body text
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0',
        wide: '.025em',
        wider: '.05em',
        widest: '.1em',
        widest2: '.2em', // Extra wide for small caps
      }
    },
  },
  plugins: [],
};
export default config;