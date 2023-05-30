import { type Config } from "tailwindcss";

import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#2196F3",
        hoverColorBg: "#21CBF3",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      height: {
        120: "30rem",
      },
      flexGrow: {
        1: '1',
        9: '9'
      }
    },
  },
  tailwindAttributes: ['className'],
  plugins: [],
} satisfies Config;
