/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        'secondary-color': '#6c757d',
        'dark-2': '#2d3748',
      },
    },
  },
  plugins: [],
};
