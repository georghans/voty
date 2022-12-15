/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: "#0F0F10",
        "dark-pink": "#FF03F7",
        "han-purple": "#7D35FF",
      },
      fontFamily: {
        lato: ["Lato", "system-ui", "sans-serif"],
        lexend: ["Lexend Deca", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
