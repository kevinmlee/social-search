/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary-color-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-color-rgb) / <alpha-value>)',
        'border-dark': '#2d2f2f',
        'border-light': '#eaeaea',
        'dark': '#161819',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        merriweather: ['var(--font-merriweather)', 'serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'media',
}