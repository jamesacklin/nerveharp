/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    fontFamily: {
      sans: ['Computer Modern Sans', 'Arial', 'sans-serif'],
      serif: ['Computer Modern Serif', 'Times New Roman', 'serif'],
      mono: ['Computer Modern Typewriter', 'Courier', 'monospace']
    },
    extend: {},
  },
  plugins: [],
}
