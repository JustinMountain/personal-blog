/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // grey and yellow
        'primary': '#222831',
        'secondary': '#393E46',
        'accent': '#FFD369',
        'light': '#EEEEEE',
      },
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'roboto-condensed': ['"Roboto Condensed"', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'alegreya': ['Alegreya', 'serif'],
        'roboto-slab': ['"Roboto Slab"', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
