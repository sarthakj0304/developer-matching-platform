/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'index.html', // This checks the classes used in your index.html file
    './src/**/*.{js,jsx,ts,tsx}', // This checks all JS/JSX/TS/TSX files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
