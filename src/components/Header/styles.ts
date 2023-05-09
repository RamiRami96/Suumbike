import Link from "next/link";
import { AppBar, Typography } from "@mui/material";

import { styled } from "@mui/system";

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.light,
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,

  "&:focus, &:hover, &:visited, &:link, &:active": {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
}));
