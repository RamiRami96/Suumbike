import Start from "@/components/Start/Start";
import StreamView from "@/components/StreamView/StreamView";
import { useState } from "react";

export default function Page() {
  const [streamMode, setStreamMode] = useState(false);

  const handleClick = () => setStreamMode(!streamMode);

  return streamMode ? <StreamView /> : <Start handleClick={handleClick} />;
}
