"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";

type Props = {
  session: Session;
};

export default function StartButton({ session }: Props) {
  const { push } = useRouter();
  const handleClick = () => {
    if (!session?.user) {
      signIn();
    }
    push("/stream");
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        className="h-48 w-48 rounded-full bg-pink-300 text-white font-bold uppercase"
        onClick={handleClick}
      >
        Start
      </button>
    </div>
  );
}
