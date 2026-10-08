import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Majd reference: warm cream page + near-black ink.
        paper: "#faf7f3",
        ink: "#111111",
        // Dark accent surfaces sit ON the cream page (cards, nav, footer) — not the page base.
        ink2: "#1a1a1a",
        muted: "#6b6b6b",
        mutedInk: "#a8a8a8",
        line: "#111111",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        control: "8px",
        card: "20px",
      },
      maxWidth: {
        content: "80rem",
      },
      letterSpacing: {
        tightest2: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
