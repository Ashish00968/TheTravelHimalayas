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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#adc6ff",
          focus: "#d8e2ff",
          foreground: "#002e6a",
        },
        surface: {
          DEFAULT: "#131313",
          glass: "rgba(255, 255, 255, 0.05)",
          glassHover: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          glass: "rgba(255, 255, 255, 0.08)",
          glassHover: "rgba(255, 255, 255, 0.15)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "sans-serif"],
        display: ["var(--font-sora)", "sans-serif"],
      },
      transitionTimingFunction: {
        'ethereal': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      borderRadius: {
        none: "0px",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      letterSpacing: {
        'ethereal-tight': '-0.02em',
        'ethereal-label': '0.1em',
      }
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
