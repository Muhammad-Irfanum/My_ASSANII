/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        bgColor : ['#0AD1C8', '#073235'],
        buttonColor : '#80ED99',
        cardColor : 'rgba(255, 255, 255, 0.9)',
        'secondary': '#073235',
        'danger': '#FF6347',
        'success': '#00FF00',
        'info': '#87CEEB',
        'warning': '#FFA500',
      }
    },
  },
  plugins: [],
}