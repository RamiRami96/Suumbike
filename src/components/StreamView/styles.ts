import { Container, Unstable_Grid2 as Grid, Box } from "@mui/material";
import { styled } from "@mui/system";

export const BottomContainer = styled(Container)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  boxShadow:
    "0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)",
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

export const ContainerView = styled(Grid)<{ avatar?: string }>(
  ({ avatar }) => ({
    backgroundImage: `url(${avatar})`,
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    height: "91.4vh",
    backgroundSize: "contain",
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
  })
);

export const RightBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
});

export const Video = styled("video")(({ theme }) => ({
  height: 90.8,
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 10,
}));

export const ContainerViewMob = styled(Grid)<{ avatar?: string }>(
  ({ avatar }) => ({
    backgroundImage: `url(${avatar})`,
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    height: "100%",
    backgroundSize: "cover",
    position: "fixed",
    left: 0,
    bottom: "-50px",
    width: "100%",
  })
);

export const BottomContainerMob = styled(Container)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.light,
  display: "flex",
  justifyContent: "center",
  paddingBottom: 25,
  paddingTop: 25,
  boxShadow:
    "0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)",
}));

export const LeftBoxMob = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: 30,
  top: 25,
}));

export const RightBoxMob = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 15,
  top: 25,
}));
