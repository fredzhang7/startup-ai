const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss,sass}",
    './lib/**/*.{ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{css,scss,sass}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [
    nextui({
      themes: {
        "purple-dark": {
          extend: "light", // <- inherit default values from light theme
          colors: {
            background: "#0D001A",
            foreground: "#B026FF",
            primary: {
              50: "#3B096C",
              100: "#520F83",
              200: "#7318A2",
              300: "#9823C2",
              400: "#c031e2",
              500: "#DD62ED",
              600: "#F182F6",
              700: "#FCADF9",
              800: "#FDD5F9",
              900: "#FEECFE",
              DEFAULT: "#DD62ED",
              foreground: "#FFFFFF",
            },
            default: "#B026FF",
            focus: "#F182F6",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    })],
  variants: {
    extend: {
      foregroundColor: ['purple-dark'],
      backgroundColor: ['purple-dark'],
      textColor: ['purple-dark'],
      colors: ['purple-dark'],
    },
  },
  darkMode: "class",
};
