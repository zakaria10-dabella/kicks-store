/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F2F0EA',
        bone: '#E6E2D8',
        jet: '#0E0E0E',
        graphite: '#2A2A2A',
        volt: '#FF4D1F',
        acid: '#D7FF3A',
        cobalt: '#2B59FF',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
