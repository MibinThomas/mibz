import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#f5f5f5",
        brand: {
          dark: "#050505",
          card: "#0d0d0d",
          emerald: "#10b981",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            650: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
            950: "#090d16",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-emerald": "glow-emerald 2s ease-in-out infinite alternate",
        "glow-blue": "glow-blue 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "glow-emerald": {
          "0%": { boxShadow: "0 0 5px rgba(16, 185, 129, 0.2), 0 0 10px rgba(16, 185, 129, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.3)" },
        },
        "glow-blue": {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.2), 0 0 10px rgba(59, 130, 246, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
