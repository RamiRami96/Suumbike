/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "light-purple": "#B783EB",
      },
      colors: {
        "light-purple": "#B783EB",
        "dark-purple": "#1B1142",
      },
      borderColor: {
        "light-purple": "#B783EB",
      },
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "waving-couple": "wave 2s linear infinite",
        "fade-in-element": "fade-in 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
