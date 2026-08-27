/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8CC6A',
          dark: '#A88920',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#aaaaaa',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'spin-slow': 'spin 10s linear infinite',
        'fade-up': 'fadeUp 0.4s ease forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      aspectRatio: {
        '3/4': '3 / 4',
      }
    },
  },
  plugins: [],
}
