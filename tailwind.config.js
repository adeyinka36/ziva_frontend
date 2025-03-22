/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors:{
    primary: '#ffc75f',
        secondary: '#4e2b00',
        light: '#dfe0df',
        dark: '#007663',
        white: '#ffffff',
        black: '#000000',
        yellow: '#FFFF00',
        lightYellow: '#ffde8f',
        darkYellow: '#FFC107',
        lightYellowOpacity: '#FFFF0090'
    },
    extend: {},
  },
  plugins: [],
}

