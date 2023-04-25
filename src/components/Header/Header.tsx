import { useState, MouseEvent } from "react";
import Link from "next/link";

import {
  AppBar,
  Container,
  Box,
  Typography,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Theme,
} from "@mui/material";
import { styled } from "@mui/system";

import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";

import Auth from "./Auth";

const pages = [
  { title: "start", link: "/" },
  { title: "contacts", link: "/contacts" },
];

const StyledLink = styled(Link)<{ isMobile?: boolean }>(
  ({ theme, isMobile }) => ({
    textDecoration: "none",
    color: isMobile
      ? theme.palette.secondary.dark
      : theme.palette.secondary.main,

    "&:focus, &:hover, &:visited, &:link, &:active": {
      textDecoration: "none",
      color: isMobile
        ? theme.palette.secondary.dark
        : theme.palette.secondary.main,
    },
  })
);

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Suumbike
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ title, link }) => (
                <StyledLink href={link} isMobile>
                  <MenuItem key={title} onClick={handleCloseNavMenu}>
                    {title}
                  </MenuItem>
                </StyledLink>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Suumbike
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ title, link }) => (
              <Button key={title} href={link} component={StyledLink}>
                {title}
              </Button>
            ))}
          </Box>
          <Auth />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
