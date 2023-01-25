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
      fontFamily: {
        base: ["var(--font-inter)"],
      },
      keyframes: {
        "fade-in-out": {
          "0%": { opacity: 0 },
          "20%, 70%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "rotate-gradient-glow": {
          from: {
            transform: "scale(3) rotateZ(0deg)",
          },
          to: {
            transform: "scale(3) rotateZ(360deg)",
          },
        },
      },
      animation: {
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in-out":
          "fade-in-out 0.5s cubic-bezier(.13,.74,.84,.43) 1 forwards",
        "rotate-gradient-glow": "rotate-gradient-glow 2000ms linear infinite",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/line-clamp"),
  ],
};
