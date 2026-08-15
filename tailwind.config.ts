import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f172a",
        "surface-card": "#131c31",
        "surface-card-hover": "#1a2642",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "border-glow": "rgba(0, 242, 254, 0.25)",
        primary: {
          DEFAULT: "#00f2fe",
          hover: "#4facfe",
          muted: "rgba(0, 242, 254, 0.15)",
        },
        accent: {
          purple: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(0, 242, 254, 0.4)",
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.4)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
