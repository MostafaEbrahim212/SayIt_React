/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
  extend: {
    
    fontFamily:{
      sans: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    colors: {
      primary: '#121212',    // الخلفية العامة، أسود داكن جدًا
      secondary: '#1E1E1E',  // خلفية الكروت و inputs
      accent: '#3B82F6',     // زرار / highlights (Blue Tailwind default)
      dark: '#E5E5E5',       // النصوص الرئيسية
    }
  },
},
  plugins: [],
}