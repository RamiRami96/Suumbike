"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Unstable_Grid2 as Grid,
  Box,
  ButtonGroup,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

import FrontCamera from "./FrontCamera";

const BottomContainer = styled(Container)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  backgroundColor: `${theme.palette.primary.main}10`,
  borderRadius: "25px 25px 0 0",
}));

const GridContainer = styled(Grid)({
  dispaly: "flex",
  alignItems: "center",
  paddingTop: 25,
  paddingBottom: 25,
});

const CenterGrid = styled(Grid)({
  display: "flex",
  justifyContent: "center",
});

const CenterGridV2 = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "75vh",
});

const RightBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
});

export default function StreamView() {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  return (
    <>
      <CenterGridV2>
        <CircularProgress />
      </CenterGridV2>
      <BottomContainer>
        <GridContainer container spacing={2}>
          <Grid xs={4}>
            <Box>
              <Typography variant="h5" sx={{ color: "primary.main" }}>
                {`${minute}:${second.toString().padStart(2, "0")}`}
              </Typography>
            </Box>
          </Grid>
          <CenterGrid xs={4}>
            <Box>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                <Button>Smash</Button>
                <Button>Pass</Button>
              </ButtonGroup>
            </Box>
          </CenterGrid>
          <Grid xs={4}>
            <RightBox>
              <FrontCamera />
            </RightBox>
          </Grid>
        </GridContainer>
      </BottomContainer>
    </>
  );
}
