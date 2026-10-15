/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F1F0EC',
        tile: '#E5E4E0',
        ink: '#121211',
        soft: '#5E5C57',
        accent: '#2F3CF5',
        'accent-hi': '#8E96FF',
        mute: '#A3A09A',
      },
      fontFamily: {
        display: ['"Archivo Variable"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['"Geist Variable"', 'Geist', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
}
