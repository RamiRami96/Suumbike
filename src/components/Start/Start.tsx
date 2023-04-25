import { Container, Button } from "@mui/material";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.25;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const CircleButton = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  width: "200px",
  height: "200px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const CenteredContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "91vh",
});

type Props = {
  handleClick: () => void;
};

export default function Start({ handleClick }: Props) {
  return (
    <CenteredContainer>
      <CircleButton onClick={handleClick}>Click me</CircleButton>
    </CenteredContainer>
  );
}
