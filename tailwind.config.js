export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F6FEB',
        secondary: '#8250DF',
        accent: '#2DA44E',
        background: '#0D1117',
        surface: '#161B22',
        text: '#C9D1D9',
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '1.5rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(31, 111, 235, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
