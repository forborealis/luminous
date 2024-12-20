/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      xs: ["12px", "16px"],
      sm: ["14px", "20px"],
      base: ["16px", "19.5px"],
      lg: ["18px", "21.94px"],
      xl: ["20px", "24.38px"],
      "2xl": ["24px", "29.26px"],
      "3xl": ["28px", "50px"],
      "4xl": ["48px", "58px"],
      "8xl": ["96px", "106px"],
    },
    extend: {
      fontFamily: {
        palanquin: ["Palanquin", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#ECEEFF",
        "coral-red": "#E98EAD",
        "dark-pink": "#FEA1BF",
        "light-pink": "#FFC6D3",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#3A4F7A",
        "white-400": "#EEEDEB",
        customColor: "#1E201E"

        // https://colorhunt.co/palette/3a4f7affc6d3fea1bfe98ead
      },
      boxShadow: {
        "3xl": "0 10px 40px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        hero: "url('assets/images/collection-background.jpg')",
      },
      screens: {
        wide: "1440px",
      },
    },
  },
  plugins: [],
};
