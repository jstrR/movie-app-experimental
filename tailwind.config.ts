import { type Config } from "tailwindcss";

import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: 'media',
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        main: "color(display-p3 0.28634 0.5797 0.9253)",
        hoverMain: "color(display-p3 0.37886 0.7845 0.93553)",
        mainDark: "color(display-p3 0.38964 0.39582 0.91255)",
        hoverMainDark: "color(display-p3 0.46094 0.4702 0.94862)",
        mainBg: "color(display-p3 0.97073 0.98 0.98734)",
        mainBgDark: "color(display-p3 0.12638 0.15954 0.2256)",
        disabledDark: "color(display-p3 0.69482 0.69791 0.96678)",
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
