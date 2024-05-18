import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss,sass}",
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        blue: {
          '400': '#1DA1F2',
          '300': '#1A91DA',
          '200': '#AAB8FF',
        },
        indigo: {
          '400': '#6574CD',
        },
        red: {
          '400': '#E0245E',
          '300': '#FF0000',
        },
        orange: {
          '400': '#FFA500',
          '300': '#FFD700',
          '200': '#FFCC80',
        },
        violet: {
          '400': '#A163A9',
          '300': '#8A63D2',
          '200': '#D6BCFA',
        },
        green: {
          '400': '#17BF63',
          '100': '#E6FFFA',
        },
        cream: {
          100: '#f5f5dc',
        },
        peach: {
          100: '#ffdab9',
        },
        blush: {
          100: '#ff6b6b',
        },
        sunset: {
          500: '#ff9e9e',
        },
        rose: {
          500: '#ff6b6b',
        },
        pearl: {
          50: '#fdfdfd',
        },
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        "purple-dark": {
          extend: "light",
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
    }
};
export default config;
