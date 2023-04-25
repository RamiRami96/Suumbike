import { useState, MouseEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { signIn, signOut, useSession } from "next-auth/react";

const SignInButton = styled(Button)(({ theme }) => ({
  background: "#fff",
  color: theme.palette.primary.main,
}));

export default function Auth() {
  const { data: session } = useSession();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (session?.user) {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar src={session.user?.image || ""} alt="avatar" />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center" onClick={() => signOut()}>
              Log out
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <SignInButton variant="contained" onClick={() => signIn()}>
        Sign in
      </SignInButton>
    </Box>
  );
}
