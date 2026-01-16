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
        vemus: {
          bg: "#FDFBF7",       // The warm cream background
          gold: "#8B7E58",     // The muted olive/gold top bar
          black: "#1A1A1A",    // Soft black text
          gray: "#555555",     // Description text
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-jost)', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
export default config;