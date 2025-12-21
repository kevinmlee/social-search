/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        accent: 'var(--primary-color)',
        'border-dark': '#2d2f2f',
        'border-light': '#eaeaea',
        'bg-dark': 'rgb(22, 24, 25)',
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