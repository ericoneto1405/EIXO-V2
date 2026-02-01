/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',
        'primary-dark': '#15803d',
        secondary: '#4b5563',
        light: '#f3f4f6',
        dark: '#111827',
        'dark-card': '#1f2937',
      },
    },
  },
  plugins: [],
};
