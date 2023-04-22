import { useSession, signIn, signOut } from "next-auth/react";
import Logged from "../Auth/Logged";
import Login from "../Auth/Login";

export default function Header() {
  const { data: session } = useSession();
  console.log(session?.user);
  return (
    <header>
      {session?.user ? (
        <Logged session={session} signOut={signOut} />
      ) : (
        <Login signIn={signIn} />
      )}
    </header>
  );
}
