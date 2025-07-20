"use client";

import { useVideoRoom } from "@/modules/room/hooks/useVideoRoom";
import Image from "next/image";
import { Spinner } from "@/modules/layout/components/spinner";

type Props = {
  roomId: string;
  isUsersRoom?: boolean;
};

export default function Room({ roomId, isUsersRoom }: Props) {
  const {
    userVideoRef,
    peerVideoRef,
    participant,
    leaveRoom,
    likeParticipant,
    isBtnDisabled,
    isLoading,
  } = useVideoRoom(roomId, isUsersRoom);

  return (
      <section className="relative h-[90dvh] flex justify-center mt-50">
        <div className="absolute z-10 top-10 right-3">
          <div className={userVideoRef ? " " : "animate-pulse"}>
            <video
              className="h-20 border border-pink-600 rounded-2xl w-[106px] bg-pink-600"
              autoPlay
              ref={userVideoRef}
              muted
            />
          </div>
        </div>
        {participant && !isLoading && (
        <div className="absolute z-10 bottom-0 w-50 h-24 flex justify-center  items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
          <div className="flex">
            <button
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
                disabled={isBtnDisabled}
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
        )}
        <h4 className="absolute z-50 bottom-40 font-black text-pink-600 text-4xl">
          {participant ? participant.name : "My room"}
        </h4>
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          {participant && !isLoading ? (
            <div className="w-4/5 h-4/5 max-w-4xl max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-600">
              <video
                className="w-full h-full object-cover"
                ref={peerVideoRef}
                autoPlay
                muted
              />
            </div>
          ) : (
            <div className="w-4/5 h-4/5 max-w-4xl max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-600 flex justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>
      </section>
  );
}
