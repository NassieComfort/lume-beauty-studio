/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        lume: {
          chocolate: "#2A1712",
          espresso: "#3B2119",
          charcoal: "#171514",
          cream: "F7F3ED",
          grey: "#77716D",
        },
      },

      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["inter", "sans-serif"],
      },

      boxShadow:{
        lume: "0 20px 60px rgba(0,0,0.25)",
      },
    },
  },

  plugins: [],

};