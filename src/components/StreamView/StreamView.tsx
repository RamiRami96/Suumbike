"use client";

import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
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
import { useSession } from "next-auth/react";

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

export const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      name
      avatar
      email
    }
  }
`;

type User = {
  [key: number]: any;
  length: number;
  name: string;
  email: string;
  image: string;
};

export default function StreamView() {
  const { loading, error, data } = useQuery(GET_PROFILES);
  const { data: session } = useSession();

  const [candidate, setCandidate] = useState<User | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  function getCandidate(users: User[], user?: User): void {
    if (user && users?.length) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (user?.email === randomUser.email) return getCandidate(users, user);

      setCandidate(randomUser);
    }

    return;
  }

  function onSmash(users: User[], user?: User) {
    return getCandidate(users, user);
  }

  function onPass() {
    console.log("add to DB and navigate to success page");
  }

  useEffect(() => {
    getCandidate(data.profiles, session?.user as User | undefined);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      return onPass();
    }
    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  return (
    <>
      <CenterGridV2>
        {!candidate ? (
          <CircularProgress />
        ) : (
          <Typography variant="h1" sx={{ color: "primary.main" }}>
            {candidate.name}
          </Typography>
        )}
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
                <Button
                  onClick={() =>
                    onSmash(data.profiles, session?.user as User | undefined)
                  }
                >
                  Smash
                </Button>
                <Button onClick={onPass}>Pass</Button>
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
