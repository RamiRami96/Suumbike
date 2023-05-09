import { Container, Button } from "@mui/material";
import { styled } from "@mui/system";

export const CircleButton = styled(Button)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: 100,
  color: theme.palette.primary.main,
  fontSize: 18,
  fontWeight: "bold",
  position: "relative",
  zIndex: 0,
  transition: "opacity .3s ease-in-out",

  "&:before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    zIndex: -1,
    width: "calc(100% + 4px)",
    height: "calc(100% + 4px)",
    background:
      "linear-gradient(45deg, #FF0000, #FA2D86, #E334CC, #D82DFA, #A12BF0, #FF0000, #FA2D86, #D82DFA, #A12BF0)",
    backgroundSize: "400%",
    borderRadius: 100,
    filter: "blur(5px)",
    animation: "glowing 20s linear infinite",
  },

  "&:after": {
    content: '""',
    position: "absolute",
    zIndex: -1,
    width: "100%",
    height: "100%",
    background: theme.palette.primary.light,
    left: 0,
    top: 0,
    borderRadius: 100,
  },

  "@keyframes glowing": {
    "0%": {
      backgroundPosition: "0 0",
    },
    "50%": {
      backgroundPosition: "400% 0",
    },
    "100%": {
      backgroundPosition: "0 0",
    },
  },
}));

export const CenteredContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "91vh",
});
