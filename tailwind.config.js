const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/client-pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      mono: ["var(--font-fira_code)"], // overriding mono
    },
    extend: {
      colors: {
        primary: colors.teal,
      },
      fontFamily: {
        base: ["var(--font-inter)"],
      },
      keyframes: {
        "fade-in-out": {
          "0%": { opacity: 0 },
          "20%, 70%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in-out":
          "fade-in-out 0.5s cubic-bezier(.13,.74,.84,.43) 1 forwards",
        "gradient-x": "gradient-x 5s linear infinite",
        "gradient-y": "gradient-y 5s linear infinite",
        "gradient-xy": "gradient-xy 5s linear infinite",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/line-clamp"),
  ],
};
