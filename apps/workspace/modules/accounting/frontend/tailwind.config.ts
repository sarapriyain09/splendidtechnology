import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e2433",
        teal: "#0f766e",
        mint: "#dcfce7",
      },
    },
  },
  plugins: [],
};

export default config;
