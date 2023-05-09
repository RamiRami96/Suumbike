import { createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontSize: 14,
    fontFamily: montserrat.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#FF0000",
      light: "#FFF",
      dark: "#000",
    },
    secondary: {
      main: "#fff",
    },

    background: {
      default: "#fff",
    },
  },
});

export default theme;
