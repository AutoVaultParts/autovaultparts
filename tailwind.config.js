/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#1a2d4a',
        },
        orange: {
          brand: '#E8590A',
          light: '#ff6b1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        heading: ['Rajdhani', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}