/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",  // Fixed color code
        "primary-100": "#ffc929",
        "secondary-200": "#00b050",
        "secondary-100": "#0b1a78",
      }
    },
  }
}
