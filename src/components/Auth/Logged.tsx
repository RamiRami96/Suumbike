import { Session } from "next-auth";
import Image from "next/image";

type Props = {
  session: Session;
  signOut: () => void;
};

export default function Logged({ session, signOut }: Props) {
  return (
    <>
      Signed in as <h1 style={{ color: "red" }}>{session?.user?.name}</h1>{" "}
      <br />
      <Image
        width={64}
        height={64}
        src={session.user?.image || ""}
        alt="avatar"
      />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}
