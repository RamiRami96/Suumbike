import { Container, Unstable_Grid2 as Grid, Box } from "@mui/material";
import { styled } from "@mui/system";

export const BottomContainer = styled(Container)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  backgroundColor: `${theme.palette.primary.main}90`,
  borderRadius: "25px 25px 0 0",
}));

export const GridContainer = styled(Grid)({
  dispaly: "flex",
  alignItems: "center",
  paddingTop: 25,
  paddingBottom: 25,
});

export const CenterGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center",
});

export const CenterGridV2 = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "75vh",
});

export const CenterGridV3 = styled(Grid)<{ avatar?: string }>(
  ({ avatar, theme }) => ({
    backgroundImage: `url(${avatar})`,
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    height: "91.4vh",
    [theme.breakpoints.down("sm")]: {
      backgroundSize: "cover",
    },
    [theme.breakpoints.up("md")]: {
      backgroundSize: "contain",
    },
  })
);

export const RightBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
});

export const Video = styled("video")(({ theme }) => ({
  height: 90.8,
  border: `2px solid ${theme.palette.primary.light}`,
  borderRadius: 10,
}));
