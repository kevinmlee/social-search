/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(210, 193, 156)',
        'border-dark': '#2d2f2f',
        'border-light': '#eaeaea',
        'bg-dark': 'rgb(22, 24, 25)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'media', // Use system preference
}
