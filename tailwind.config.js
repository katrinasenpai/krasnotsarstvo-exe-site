// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Цветовая палитра
      colors: {
        'midnight-ink': '#0A0C1A',
        'ancient-parchment': '#F5E9D3',
        'mystic-cyan': '#00F2FF',
        'gold-leaf': '#f0b65a',
        'off-white': '#EAEAEA',
        'deep-blue-ink': '#1E2A4A',
        'shadow-grey': '#333850',
      },
      // Шрифты
      fontFamily: {
        sans: ['PFDinTextPro', 'sans-serif'],
        serif: ['Kereru', 'serif'],
        handwriting: ['Caveat', 'cursive'], 
      },

      backgroundImage: {
        'mystic-pattern': "url('/src/assets/images/background-pattern.svg')",
      },
      
      // Анимации
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 3px rgba(100, 248, 253, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 10px rgba(100, 248, 253, 0.8))' },
        },
        // Добавлена анимация плавного появления
        'fade-in': {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Добавлен класс для использования анимации
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};