import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  console.log(session?.user);
  if (session) {
    return (
      <>
        Signed in as <h1 style={{ color: "red" }}>{session?.user?.name}</h1>{" "}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
