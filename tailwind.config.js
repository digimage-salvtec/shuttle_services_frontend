/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      height: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
      },
      screens: {
        "2xs": "480px", // Custom screen size for less than 480px
        xs: "600px", // Custom screen size for less than 600px
        sm: "768px", // Custom screen size for less than 768px
        md: "980px", // Custom screen size for less than 980px
        lg: "1024px", // Custom screen size for less than 1024px
        xl: "1120px", // Custom screen size for 1120px and up
      },
      maxWidth: {
        "95p": "95%",
        "90p": "90%",
        "85p": "85%",
        "80p": "80%",
        "75p": "75%",
      },
    },
    // configure app color palette
    colors: {
      primary: "#42826B",
      primary_opac: "#81B6A4",
      alt: "#FFC83E",
      accent: "#adcdc4",
      text_light: "#FCFCFC",
      text_dark: "#333",
    },
    fontFamily: {
      poppins: "Poppins",
    },
    backdropBrightness: {
      25: ".25",
      175: "1.75",
    },
    backgroundImage: {
      "hero-pattern": "url('/src/assets/shuttle_services_hero_alt.jpg')",
      "footer-texture": "url('/img/footer-texture.png')",
    },
  },
  plugins: [require("flowbite/plugin")],
};
