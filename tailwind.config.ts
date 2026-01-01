import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./client/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["Menlo", "monospace"],
        urdu: ["Noto Nastaliq Urdu", "Amiri", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;