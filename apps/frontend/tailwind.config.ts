import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "electric-cyan": "#04D9FF",
        "brand-purple": "#6D28D9",
        "neutral-bg": "#f5f5f5",
      },
    },
  },
  plugins: [],
};

export default config;
