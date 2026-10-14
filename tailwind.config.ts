import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8f1",
          100: "#feefdc",
          200: "#fcdab7",
          300: "#fabf87",
          400: "#f69a53",
          500: "#f0742b",
          600: "#e05820",
          700: "#ba401c",
          800: "#94341e",
          900: "#782e1c",
        },
        amazon: {
          orange: "#FF9900",
          hover: "#e68a00",
          dark: "#146EB4",
        },
      },
    },
  },
  plugins: [],
};
export default config;
