/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    fontFamily: {
      sans: ["Computer Modern Sans", "Arial", "sans-serif"],
      serif: ["Computer Modern Serif", "Times New Roman", "serif"],
      mono: ["Computer Modern Typewriter", "Courier", "monospace"],
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: "18px" },
      });
    }),
  ],
};
