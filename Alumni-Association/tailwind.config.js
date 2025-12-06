/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
          light: '#93C5FD'    // blue-300
        },
        secondary: {
          DEFAULT: '#8B5CF6', // purple-500
          dark: '#7C3AED',    // purple-600
          light: '#A78BFA'    // purple-400
        },
        accent: {
          DEFAULT: '#EAB308', // yellow-500
          dark: '#CA8A04',    // yellow-600
          light: '#FACC15'    // yellow-400
        },
        dark: '#111827',      // gray-900
        light: '#F9FAFB'      // gray-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        slideUp: {
          'from': { 
            transform: 'translateY(30px)',
            opacity: '0' 
          },
          'to': { 
            transform: 'translateY(0)',
            opacity: '1' 
          }
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 30px -5px rgba(59, 130, 246, 0.7)'
      },
      transitionDuration: {
        'slow': '600ms',
        'medium': '400ms',
        'fast': '200ms'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate')
  ],
}