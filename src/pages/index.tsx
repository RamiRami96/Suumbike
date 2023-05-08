import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Start from "@/components/Start/Start";
import StreamView from "@/components/StreamView/StreamView";

export default function Page() {
  const { data: session } = useSession();

  const [streamMode, setStreamMode] = useState(false);

  const handleClick = () => {
    if (session?.user) {
      setStreamMode(!streamMode);
    } else {
      signIn();
    }
  };

  return streamMode ? (
    <StreamView handleClick={handleClick} />
  ) : (
    <Start handleClick={handleClick} />
  );
}
