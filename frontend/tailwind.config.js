/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lume: {
          black: "#0B0B0B",
          charcoal: "#171412",
          gold: "#C9A24B",
          "gold-light": "#E4C77A",
          cream: "#F5F1E8",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
