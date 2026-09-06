import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B120C",
        bark: "#2E1C11",
        "bark-2": "#3E2718",
        ember: {
          400: "#E89A5F",
          500: "#D97B3E",
          600: "#B65A26",
          700: "#8F431C",
        },
        gold: {
          DEFAULT: "#D3A24C",
          soft: "#E9CD97",
        },
        cream: {
          DEFAULT: "#FBF4E7",
          2: "#F3E9D6",
        },
        leaf: {
          600: "#557242",
          700: "#3E5A32",
          soft: "#DCE7D2",
        },
        charcoal: "#241A12",
        muted: "#7A6A57",
        danger: { DEFAULT: "#A63A2E", soft: "#F5DCD6" },
        warn: { DEFAULT: "#B6811F", soft: "#F6E7C4" },
        ok: { DEFAULT: "#3E5A32", soft: "#DCE7D2" },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      maxWidth: {
        wrap: "1180px",
      },
    },
  },
  plugins: [],
};
export default config;
