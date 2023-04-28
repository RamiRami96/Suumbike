import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
      light: "#fff",
    },
    secondary: {
      main: "#fff",
      dark: "#000",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
