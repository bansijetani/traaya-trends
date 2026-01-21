import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // FIX: Add "./src" to these paths so Tailwind sees your files inside the 'src' folder
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verus: {
          bg: "#FDFBF7",
          gold: "#B87E58",
          black: "#1A1A1A",
          gray: "#555555",
        }
      },
      // ... keep your other theme settings
    },
  },
  plugins: [],
};
export default config;