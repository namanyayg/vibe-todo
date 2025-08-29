/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'linear-bg': '#0F0F10',
        'linear-card': '#1A1B23',
        'linear-border': '#2E2F3A',
        'linear-text': '#B3B3B3',
        'linear-purple': '#5E5CE6',
        'linear-green': '#00D9A5',
        'linear-orange': '#FF6B35',
        'linear-blue': '#2563EB',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}