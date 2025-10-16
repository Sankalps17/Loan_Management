/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7ff',
          100: '#d7e4ff',
          200: '#adc7ff',
          300: '#83aaff',
          400: '#598dff',
          500: '#306fff',
          600: '#1153e6',
          700: '#0b3db3',
          800: '#072880',
          900: '#03134d'
        }
      }
    }
  },
  plugins: []
};
