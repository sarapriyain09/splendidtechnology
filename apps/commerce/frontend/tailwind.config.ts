import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slateDeep: "#0F172A",
        steel: "#1E293B",
        ember: "#F97316",
        mint: "#34D399"
      }
    }
  },
  plugins: []
};

export default config;
