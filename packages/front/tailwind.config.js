const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx}'], 
  darkMode: false, // or 'media' or 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      white: colors.white,
      black: colors.black,
      primary: {
        lighter: '#6d331f',
        light: '#492215',
        DEFAULT: '#3c1a0f',
      },
      neutral: {
        lighter: '#f6f4f3',
        light: '#EBE7E5',
        DEFAULT: '#AFA39C',
        dark: '#80726B',
        darker: '#514137'
      },
      success: {
        DEFAULT: '#51BA5B',
      },
      failure: {
        DEFAULT: '#DC2626',
      }
    },
    container: {
      center: true,
    },
    fontFamily: {
      'sans': ['"Rubik"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
