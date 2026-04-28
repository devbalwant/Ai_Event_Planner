/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Maroon & Cream Theme
        maroon: {
          primary: "#8B1538",
          dark: "#5A0E24",
          light: "#A61D45",
        },
        cream: {
          DEFAULT: "#E8DCC4",
          dark: "#D4C8B0",
        },
        gold: {
          DEFAULT: "#C4A574",
          dark: "#B09560",
          light: "#D4B584",
        },
      },
    },
  },
  plugins: [],
};
