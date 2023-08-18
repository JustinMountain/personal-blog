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
      typography: {
        DEFAULT: {
          css: {
            color: '#000',
            h2: {
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              fontWeight: '400',
              margin: '0',
              padding: '0.5rem 0'
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: '600',
              margin: '0',
              padding: '1rem 0 0 0'
            },
            p: {
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              fontWeight: '400',
              margin: '0',
              padding: '1rem 0',
              overflowWrap: 'break-word'
            },
            a: {
              color: 'rgb(59 130 246)',
              '&:hover': {
                color: 'rgb(30 64 175);',
              },
              lineHeight: '1.5rem',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

// Example with hover
// h2: {
//   color: '#3182ce',
//   '&:hover': {
//     color: '#2c5282',
//   },
// },

// Add tailwind for prose:
  // h2
  // h3
  // h4
  // p
  // pre / code
  // image
  // ul
  // li
  // ol
  // link
  // blockquote?
  // check other tags from markdown guide