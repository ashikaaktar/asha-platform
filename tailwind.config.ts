import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: {
          main: "#08071F",
          secondary: "#100D2B",
          section: "#12102D",
          card: "#191638",
          darkPurple: "#24164A",
        },
        neon: {
          purple: "#8B35FF",
          purpleNeon: "#A855F7",
          violet: "#C084FC",
          blue: "#176BFF",
          softBlue: "#38BDF8",
          textLight: "#D5D2E5",
          highlight: "#B98AFF",
        },
        asha: {
          navy: "#08071F",
          primary: "#8B35FF",
          bright: "#A855F7",
          sky: "#38BDF8",
          light: "#191638",
          bg: "#08071F",
          dark: "#D5D2E5",
          border: "#24164A",
          green: "#20A887",
          softBlue: "#191638",
          softGray: "#24164A",
          cyan: "#38BDF8",
          success: "#20A887",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
