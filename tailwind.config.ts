import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
  plugins: [
    // coarse: touch screens (including 768px tablets, which use the desktop layout), for 44px targets and 16px inputs.
    // The :not(#coarse) adds specificity so it also beats md: utilities, which Tailwind emits after plugin variants.
    plugin(({ addVariant }) => addVariant("coarse", "@media (pointer: coarse) { &:not(#coarse) }")),
  ],
};

export default config;
