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
  backgroundColor: `${theme.palette.primary.main}90`,
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

const CenterGridV3 = styled(Grid)<{ avatar?: string }>(({ avatar, theme }) => ({
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
}));

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
    }
  }
`;

const LIKE_PROFILE_MUTATION = gql`
  mutation LikeProfile($profileId: ID!, $likedProfileId: ID!) {
    likeProfile(profileId: $profileId, likedProfileId: $likedProfileId) {
      likedProfiles {
        avatar
        name
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
  avatar: string;
  likedProfiles: User[];
};

const GET_PROFILE_ID = gql`
  query getProfileID($email: String!) {
    profile(email: $email) {
      id
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

type Props = {
  handleClick: () => void;
};

export default function StreamView({ handleClick }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data } = useQuery(GET_PROFILES);
  const { data: profileData } = useQuery(GET_PROFILE_ID, {
    variables: { email: (session?.user as any)?.email },
  });

  const id = profileData?.profile?.id;

  const [likeProfile] = useMutation(LIKE_PROFILE_MUTATION);

  const [candidate, setCandidate] = useState<User | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  const notUsers =
    data?.profiles.length - profileData?.profile?.likedProfiles.length === 1;

  function getCandidate(users?: User[], user?: User): void {
    if (users?.length && user) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (
        user?.email === randomUser.email ||
        user.likedProfiles.some(({ email }) => email === randomUser.email)
      )
        return getCandidate(users, user);

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
    if (!notUsers) {
      getCandidate(data?.profiles, profileData?.profile);
    }
  }, [data, profileData]);

  useEffect(() => {
    if (timeLeft === 0) {
      return onPass(id, candidate?.id);
    }

    if (!candidate && notUsers) return;

    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  return (
    <CenterGridV3 avatar={candidate?.avatar || ""}>
      <CenterGridV2>{!candidate && <CircularProgress />}</CenterGridV2>
      <BottomContainer>
        <GridContainer container spacing={2}>
          <Grid xs={4}>
            <Box>
              <Typography variant="h5" sx={{ color: "primary.light" }}>
                {`${minute}:${second.toString().padStart(2, "0")}`}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "primary.light", paddingTop: "1rem" }}
              >
                {candidate?.name}{" "}
                {`${
                  minute < 1 ? "is wanting sex with you" : "is meeting with you"
                }`}
              </Typography>
            </Box>
          </Grid>
          <CenterGrid xs={4}>
            <Box>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
                color="secondary"
              >
                <Button
                  onClick={() => onSmash(data.profiles, profileData?.profile)}
                  disabled={!candidate && notUsers}
                  color="secondary"
                >
                  Smash
                </Button>
                <Button onClick={handleClick} color="secondary">
                  Close
                </Button>
                <Button
                  onClick={() => onPass(id, candidate?.id)}
                  disabled={!candidate && notUsers}
                  color="secondary"
                >
                  Pass
                </Button>
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
    </CenterGridV3>
  );
}
