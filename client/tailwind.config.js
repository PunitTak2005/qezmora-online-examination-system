/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0F5132',
        'primary-dark': '#0A3A24',
        gold: '#D4A017',
        'gold-light': '#F2C94C',
        navy: '#112240',
        cream: '#F8F6F1',
        charcoal: '#1F2937',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        surface: '#FFFFFF',
        darkSurface: '#162032',
        darkBg: '#0B1220'
      }
    },
  },
  plugins: [],
}
