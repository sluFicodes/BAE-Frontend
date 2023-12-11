/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    fontFamily: {
      display: ['Blinker', 'IBM\\ Plex\\ Mono', 'Menlo', 'monospace'],
      body: ['Blinker', 'IBM\\ Plex\\ Mono', 'Menlo', 'monospace'],
    },
    extend: {
      colors: {
        primary: {
          50: '#00add3',
          100: '#2d58a7',
        },
        secondary: {
          50: '#dde6f6',
          100: '#14274a',
        },
      },
      transitionProperty: {
        width: "width"
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class'
}

