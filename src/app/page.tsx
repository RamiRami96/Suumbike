import StartButton from "./StartButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <StartButton session={session} />;
}
