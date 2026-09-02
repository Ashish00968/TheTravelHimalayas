import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds (midnight-indigo scale) ──────────────────────────
        background: "var(--bg-base)",
        foreground: "var(--text-high)",

        surface: {
          DEFAULT: "var(--bg-surface)",
          card:    "var(--bg-card)",
          glass:   "rgba(255,255,255,0.04)",
          glassHover: "rgba(255,255,255,0.07)",
        },

        border: {
          DEFAULT:    "rgba(255,255,255,0.07)",
          glass:      "rgba(255,255,255,0.07)",
          glassHover: "rgba(255,255,255,0.14)",
          strong:     "rgba(255,255,255,0.18)",
        },

        muted: {
          DEFAULT:    "var(--bg-muted)",
          foreground: "var(--text-low)",
        },

        // ── Brand accent — Glacier Blue ──────────────────────────────────
        primary: {
          DEFAULT:    "#3B82F6",   // glacier blue
          light:      "#60A5FA",
          dark:       "#1D4ED8",
          foreground: "#EFF6FF",
          glow:       "rgba(59,130,246,0.35)",
        },

        // ── Territory signature colours ──────────────────────────────────
        // Kashmir — Glacier Blue (shares primary)
        kashmir:  { DEFAULT: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
        // Himachal — Alpenglow Amber
        himachal: { DEFAULT: "#F59E0B", glow: "rgba(245,158,11,0.25)" },
        // Ladakh — Twilight Violet
        ladakh:   { DEFAULT: "#7C3AED", glow: "rgba(124,58,237,0.25)" },
        // Uttarakhand — Alpine Teal
        uttarakhand: { DEFAULT: "#0D9488", glow: "rgba(13,148,136,0.25)" },

        // ── Semantic helpers ─────────────────────────────────────────────
        gold:   { DEFAULT: "#F59E0B", light: "#FCD34D", dark: "#D97706" },
        ice:    { DEFAULT: "#BAE6FD", muted: "#7DD3FC" },
        snow:   "#F1F5F9",
        slate:  {
          50:  "#F8FAFC",
          200: "#E2E8F0",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          850: "#131F35",
          900: "#0F172A",
          950: "#040812",
        },
      },

      fontFamily: {
        sans:    ["var(--font-hanken)", "sans-serif"],
        display: ["var(--font-sora)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },

      transitionTimingFunction: {
        highland: "cubic-bezier(0.23, 1, 0.32, 1)",
        swift:    "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      borderRadius: {
        none:  "0px",
        sm:    "0.375rem",
        DEFAULT: "0.5rem",
        md:    "0.75rem",
        lg:    "1rem",
        xl:    "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
        full:  "9999px",
      },

      letterSpacing: {
        tighter:  "-0.04em",
        tight:    "-0.02em",
        normal:   "0em",
        wide:     "0.05em",
        wider:    "0.1em",
        widest:   "0.2em",
        "alt-cap": "0.12em",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "himalaya-hero":   "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(59,130,246,0.18), transparent)",
      },

      boxShadow: {
        "glow-blue":    "0 0 30px rgba(59,130,246,0.25), 0 0 80px rgba(59,130,246,0.10)",
        "glow-gold":    "0 0 30px rgba(245,158,11,0.25), 0 0 80px rgba(245,158,11,0.10)",
        "glow-violet":  "0 0 30px rgba(124,58,237,0.25), 0 0 80px rgba(124,58,237,0.10)",
        "glow-teal":    "0 0 30px rgba(13,148,136,0.25), 0 0 80px rgba(13,148,136,0.10)",
        "card-idle":    "0 1px 3px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)",
        "card-hover":   "0 4px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.2)",
        product:        "0 8px 60px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
