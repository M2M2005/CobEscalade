/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/*.js',
    './components/*.js'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
        muted: 'oklch(0.97 0 0)',
        'muted-foreground': 'oklch(0.556 0 0)',
        border: 'oklch(0.922 0 0)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'sm': 'calc(1.5rem * 0.6)',
        'DEFAULT': 'calc(1.5rem * 0.8)',
        'md': 'calc(1.5rem * 0.8)',
        'lg': '1.5rem',
        'xl': 'calc(1.5rem * 1.4)',
        '2xl': 'calc(1.5rem * 1.8)',
        '3xl': 'calc(1.5rem * 2.2)',
        '4xl': 'calc(1.5rem * 2.6)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
