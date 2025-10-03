/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fl-dark': '#1a1a1a',
        'fl-darker': '#0d0d0d',
        'fl-panel': '#252525',
        'fl-accent': '#f57c00',
        'fl-blue': '#2196f3',
        'fl-green': '#4caf50',
      },
    },
  },
  plugins: [],
}
