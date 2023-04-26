import { Container, Button } from "@mui/material";
import { styled } from "@mui/system";

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
