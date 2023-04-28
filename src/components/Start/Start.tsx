import { CenteredContainer, CircleButton } from "./styles";

type Props = {
  handleClick: () => void;
};

export default function Start({ handleClick }: Props) {
  return (
    <CenteredContainer>
      <CircleButton onClick={handleClick}>Start</CircleButton>
    </CenteredContainer>
  );
}
