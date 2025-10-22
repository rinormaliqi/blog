/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#ff5f57', // light red
        mint: '#a8e6a3',   // light green
        text: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
