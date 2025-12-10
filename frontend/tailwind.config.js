/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        chift: {
          teal: '#14b8a6',
          'teal-dark': '#0d9488',
          green: '#10b981',
          blue: '#3b82f6',
          purple: '#a855f7',
          pink: '#ec4899',
          red: '#ef4444',
          orange: '#f59e0b',
          yellow: '#eab308',
        }
      },
    },
  },
  plugins: [],
}
