import React from "react";
import { styled } from "@mui/system";

const SuccessContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "92vh",
});

const SuccessText = styled("h2")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "3rem",
}));

export default function Success() {
  return (
    <SuccessContainer>
      <SuccessText>Success</SuccessText>
    </SuccessContainer>
  );
}
