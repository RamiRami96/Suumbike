import { Container, Button } from "@mui/material";
import { styled } from "@mui/system";

export const CircleButton = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  width: "200px",
  height: "200px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const CenteredContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "91vh",
});
