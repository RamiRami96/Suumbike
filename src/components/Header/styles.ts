import Link from "next/link";

import { styled } from "@mui/system";

export const StyledLink = styled(Link)<{ ismobile?: string }>(
  ({ theme, ismobile }) => ({
    textDecoration: "none",
    color: ismobile
      ? theme.palette.secondary.dark
      : theme.palette.secondary.main,

    "&:focus, &:hover, &:visited, &:link, &:active": {
      textDecoration: "none",
      color: ismobile
        ? theme.palette.secondary.dark
        : theme.palette.secondary.main,
    },
  })
);
