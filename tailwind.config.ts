import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        grid: "url('/patterns/gridpattern.svg')",
      },
      colors: {
        "primary-green": "#16A34A",
        "primary-dark": "#0F172A",
        "primary-red": "#DC2626",
      },
      dropShadow: {
        "main": "0px 5px 5px rgba(22, 163, 74, 0.2)"
      }
    },
  },
  plugins: [],
};
export default config;
