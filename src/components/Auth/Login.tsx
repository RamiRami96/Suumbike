type Props = {
  signIn: () => void;
};

export default function Login({ signIn }: Props) {
  return (
    <>
      Not signed in <br />
      <button onClick={signIn}>Sign in</button>
    </>
  );
}
