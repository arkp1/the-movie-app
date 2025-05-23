/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Figtree: ["Figtree", "sans serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/aspect-ratio")],
}

