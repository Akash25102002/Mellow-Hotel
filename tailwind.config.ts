import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      colors: {
        mellow: {
          primary: "#D16806",         // Mellow Burnt Caramel / Amber Ochre
          secondary: "#F9F6F3",       // Mellow Ivory Dust / Cream background
          black: "#1A1A1A",           // Mellow Obsidian Black
          dark: "#353535",           // Mellow Charcoal body
          gray: "#777F81",           // Mellow Slate Gray
          border: "#EAE5DD",         // Mellow Warm border
          subtle: "#F4E2D8",         // Mellow Champagne border subtle
          accent: "#ECB27B",         // Mellow Apricot Gold
          light: "#FDFDFD",
        },
      },
    },
  },
  plugins: [],
};
export default config;
