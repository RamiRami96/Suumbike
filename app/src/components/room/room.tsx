"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { Spinner } from "@/components/layout/spinner";
import { User } from "@/models/user";
import { likeUser } from "@/services/room/likeUser";
import { redirect, useRouter } from "next/navigation";
import { getParticipant } from "@/services/room/getParticipant";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io(process.env.NEXT_PUBLIC__SOCKET_SERVER as string);

type Props = {
  roomId: string;
  participant: User;
};

export default function Room({ roomId, participant }: Props) {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const user = session.data?.user;

  const onPass = async (user: string, participantNick: string) => {
    try {
      setIsLoading(true);

      const participant = await getParticipant(participantNick);

      if (participant && user) {
        await likeUser((user as any).id, participant.id);
        router.push(
          `/success?name=${participant.name}&avatar=${participant.avatar}`
        );
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error while liking user:", error);
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="relative h-[90vh] flex justify-center mt-50">
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="flex">
          <button
            className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24 flex justify-center items-center"
            onClick={() => router.push("/")}
          >
            <Image
              src={"/icons/close.svg"}
              width={20}
              height={20}
              alt="close"
            />
          </button>
          <button
            className="px-4 py-2 bg-green-400  rounded-r-md w-24 flex justify-center items-center"
            onClick={() =>
              onPass((user as User).id, participant.tgNickname as string)
            }
          >
            <Image src={"/icons/like.svg"} width={20} height={20} alt="like" />
          </button>
        </div>
      </div>

      <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
        {isLoading ? "loading" : "Rami Rami"}
      </h4>
      <div>{}</div>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {isLoading ? <Spinner /> : <Spinner />}
      </div>
    </section>
  );
}
