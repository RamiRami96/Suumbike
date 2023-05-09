import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import {
  Unstable_Grid2 as Grid,
  Box,
  ButtonGroup,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSession } from "next-auth/react";

import FrontCamera from "./FrontCamera";

import { GET_PROFILES_AND_PROFILE, LIKE_PROFILE_MUTATION } from "./queries";
import {
  BottomContainer,
  BottomContainerMob,
  CenterGrid,
  CenterGridV2,
  ContainerView,
  ContainerViewMob,
  GridContainer,
  LeftBoxMob,
  RightBoxMob,
  RightBox,
} from "./styles";

type User = {
  [key: number]: any;
  id: string;
  name: string;
  email: string;
  avatar: string;
  likedProfiles: User[];
};

type Props = {
  handleClick: () => void;
};

export default function StreamView({ handleClick }: Props) {
  const router = useRouter();
  const isTabletScreen = useMediaQuery("(min-width:600px)");

  const { data: session } = useSession();

  const { data: profilesData } = useQuery(GET_PROFILES_AND_PROFILE, {
    variables: { email: (session?.user as any)?.email },
  });

  const [likeProfile] = useMutation(LIKE_PROFILE_MUTATION);

  const [candidate, setCandidate] = useState<User | null>(null);
  const [visitedUsers, setVisitedUsers] = useState<User[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  const NOT_USERS = profilesData?.profiles?.length === 0;

  const PROFILE_ID = profilesData?.profile?.id;
  const CANDIDATE_ID = candidate?.id;

  function getCandidate(users?: User[], user?: User): void {
    if (users?.length && user) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (users.length - visitedUsers.length === 0) {
        setCandidate(null);
        return;
      } else if (visitedUsers.some(({ email }) => email === randomUser.email)) {
        return getCandidate(users, user);
      }

      setCandidate(randomUser);
    }

    return;
  }

  function onSmash(users: User[], user?: User) {
    setTimeLeft(120);
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
    if (candidate) setVisitedUsers([...visitedUsers, candidate]);
  }, [candidate]);

  useEffect(() => {
    if (!NOT_USERS) {
      getCandidate(profilesData?.profiles, profilesData?.profile);
    }
  }, [profilesData]);

  useEffect(() => {
    if (timeLeft === 0) {
      return onPass(PROFILE_ID, CANDIDATE_ID);
    }

    if (!candidate || NOT_USERS) return;

    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  function renderCandidateInfo() {
    if (candidate?.name) {
      return `${candidate?.name} ${
        minute < 1 ? "is wanting sex with you" : "is meeting with you"
      }`;
    } else {
      return null;
    }
  }

  if (isTabletScreen) {
    return (
      <ContainerView avatar={candidate?.avatar || ""}>
        <CenterGridV2>{!candidate && <CircularProgress />}</CenterGridV2>
        <BottomContainer>
          <GridContainer container spacing={2}>
            <Grid xs={4}>
              <Box>
                <Typography variant="h5" sx={{ color: "primary.main" }}>
                  {`${minute}:${second.toString().padStart(2, "0")}`}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "primary.main", paddingTop: "1rem" }}
                >
                  {renderCandidateInfo()}
                </Typography>
              </Box>
            </Grid>
            <CenterGrid xs={4}>
              <Box>
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                  color="primary"
                  size="large"
                >
                  <Button
                    onClick={() =>
                      onSmash(profilesData?.profiles, profilesData?.profile)
                    }
                    disabled={!candidate || NOT_USERS}
                    color="primary"
                  >
                    Smash
                  </Button>
                  <Button onClick={handleClick} color="primary">
                    Close
                  </Button>
                  <Button
                    onClick={() => onPass(PROFILE_ID, CANDIDATE_ID)}
                    disabled={!candidate || NOT_USERS}
                    color="primary"
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
      </ContainerView>
    );
  }

  return (
    <ContainerViewMob avatar={candidate?.avatar || ""}>
      <LeftBoxMob>
        <Typography variant="h5" sx={{ color: "primary.main" }}>
          {`${minute}:${second.toString().padStart(2, "0")}`}
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: "primary.main", paddingTop: "1rem" }}
        >
          {candidate?.name}
        </Typography>
      </LeftBoxMob>
      <RightBoxMob>
        <FrontCamera />
      </RightBoxMob>
      <CenterGridV2>{!candidate && <CircularProgress />}</CenterGridV2>
      <BottomContainerMob>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined button group"
          color="primary"
          size="large"
        >
          <Button
            onClick={() =>
              onSmash(profilesData?.profiles, profilesData?.profile)
            }
            disabled={!candidate || NOT_USERS}
            color="primary"
          >
            Smash
          </Button>
          <Button onClick={handleClick} color="primary">
            Close
          </Button>
          <Button
            onClick={() => onPass(PROFILE_ID, CANDIDATE_ID)}
            disabled={!candidate || NOT_USERS}
            color="primary"
          >
            Pass
          </Button>
        </ButtonGroup>
      </BottomContainerMob>
    </ContainerViewMob>
  );
}
