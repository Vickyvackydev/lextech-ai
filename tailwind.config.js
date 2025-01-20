/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        court: "url('./assets/background.svg')",
      },
      boxShadow: {
        custom:
          "0px 0.5px 0px 0px #FFFFFF80 inset, 0px -2px 40px 0px #BB9BFF26, 0px -2px 10px 0px #E9DFFF4D",
      },

      colors: {
        primary: {
          100: "#002A7F",
          200: "#271E9A",
        },
        light: "#ECF3FF",
      },
      fontSize: {
        md: "16px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
