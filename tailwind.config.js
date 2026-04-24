/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}", // Verifica que estén todas las extensiones
],
  theme: {
    extend: {
      colors: {
        // Una paleta elegante: Púrpura "Royal" y Dorado "Champagne"
        brand: {
          dark: '#1a1a2e',
          primary: '#6d28d9', // Púrpura intenso
          accent: '#fbbf24',  // Dorado para botones Premium
          light: '#f3f4f6'
        }
      },
      fontFamily: {
        // Tipografía elegante para títulos
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}