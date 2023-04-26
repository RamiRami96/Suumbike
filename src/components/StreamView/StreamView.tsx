"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
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

const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      id
      name
      avatar
      email
      likedProfiles {
        id
        name
        avatar
        email
      }
    }
  }
`;

const LIKE_PROFILE_MUTATION = gql`
  mutation LikeProfile($profileId: ID!, $likedProfileId: ID!) {
    likeProfile(profileId: $profileId, likedProfileId: $likedProfileId) {
      likedProfiles {
        id
        name
        avatar
        email
      }
    }
  }
`;

type User = {
  [key: number]: any;
  id: string;
  name: string;
  email: string;
  image: string;
};

const GET_PROFILE_ID = gql`
  query getProfileID($email: String!) {
    profile(email: $email) {
      id
      name
      avatar
      email
    }
  }
`;

export default function StreamView() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data } = useQuery(GET_PROFILES);
  const { data: profileData } = useQuery(GET_PROFILE_ID, {
    variables: { email: (session?.user as User)?.email || "ram@gmail.com" },
  });

  const id = profileData.profile.id;

  const [likeProfile] = useMutation(LIKE_PROFILE_MUTATION);

  const [candidate, setCandidate] = useState<User | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  function getCandidate(users?: User[], user?: User): void {
    if (users && user) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (user?.email === randomUser.email) return getCandidate(users, user);

      setCandidate(randomUser);
    }

    return;
  }

  function onSmash(users: User[], user?: User) {
    return getCandidate(users, user);
  }

  function onPass(profileId?: string, likedProfileId?: string) {
    if (profileId && likedProfileId) {
      likeProfile({
        variables: {
          profileId,
          likedProfileId,
        },
      });
      router.push("/success");
    }

    return;
  }

  useEffect(() => {
    getCandidate(data?.profiles, session?.user as User | undefined);
  }, [data]);

  useEffect(() => {
    if (timeLeft === 0) {
      return onPass(id, candidate?.id);
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
                <Button onClick={() => onPass(id, candidate?.id)}>Pass</Button>
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
