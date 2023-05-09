import { styled } from "@mui/system";

export const SuccessContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "92vh",
});

export const SuccessText = styled("h2")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "2.5rem",
  textAlign: "center",
}));
