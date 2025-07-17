"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Spinner } from "@/modules/layout/components/spinner";
import useSocket from "@/modules/room/hooks/useSocket";
import { useRoomSocket } from "@/modules/room/hooks/useRoomSocket";
import { useRoomTimer } from "@/modules/room/hooks/useRoomTimer";
import { useRoomActions } from "@/modules/room/hooks/useRoomActions";
import { useRoomCoordination } from "@/modules/room/hooks/useRoomCoordination";
import { User } from "@/shared/models/user";

type Props = {
  roomId: string;
  isUsersRoom?: boolean;
};

export default function Room({ roomId, isUsersRoom }: Props) {
  useSocket();

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const user = session.data?.user as User;

  const {
    webRTC,
    users,
    participant,
    isLiked,
    isExited,
    emitCheckControls,
    emitLeave,
    updateUsers,
  } = useRoomSocket(roomId);

  const { isBtnDisabled } = useRoomTimer(participant);

  const { isLoading, leaveRoom, likeParticipant } = useRoomActions(
    isUsersRoom,
    user,
    participant,
    webRTC.cleanupConnections,
    emitLeave,
    emitCheckControls
  );

  useRoomCoordination({
    isLiked,
    isExited,
    isLoading,
    likeParticipant,
    leaveRoom,
    user,
    users,
    updateUsers,
  });

  return (
    <section className="relative h-[90dvh] flex justify-center mt-50">
      <div className="absolute z-10 top-10 right-3">
        <div className={webRTC.userVideoRef ? " " : "animate-pulse"}>
          <video
            className="h-20 border border-pink-600 rounded-2xl w-[106px] bg-pink-600"
            autoPlay
            ref={webRTC.userVideoRef}
            muted
          />
        </div>
      </div>
      <div className="absolute z-10 bottom-0 w-50 h-24 flex justify-center  items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="flex">
          <button
            disabled={isLoading}
            onClick={leaveRoom}
            className="px-4 py-2 bg-pink-600 text-white rounded-l-md w-24 flex justify-center items-center"
          >
            <Image
              src={"/icons/close.svg"}
              width={20}
              height={20}
              alt="close"
              placeholder="blur"
              blurDataURL={"/icons/close.svg"}
            />
          </button>
          <button
            disabled={isLoading || isBtnDisabled}
            onClick={likeParticipant}
            className="px-4 py-2 bg-green-400 disabled:bg-green-100 rounded-r-md w-24 flex justify-center items-center"
          >
            <Image
              src={"/icons/like.svg"}
              width={20}
              height={20}
              alt="like"
              placeholder="blur"
              blurDataURL={"/icons/like.svg"}
            />
          </button>
        </div>
      </div>
      <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
        {participant ? participant.name : "My room"}
      </h4>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {webRTC.peerVideoRef && !isLoading ? (
          <video
            className="fixed top-2 left-0 w-full h-full object-cover"
            ref={webRTC.peerVideoRef}
            autoPlay
            muted
          />
        ) : (
          <Spinner />
        )}
      </div>
    </section>
  );
}
