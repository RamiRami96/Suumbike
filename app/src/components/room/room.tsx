"use client";

import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { Spinner } from "@/components/layout/spinner";
import { User } from "@/models/user";
import { likeUser } from "@/services/profile/likeUser";
import { useRouter } from "next/navigation";
import { getParticipant } from "@/services/room/getParticipant";
import useSocket from "@/hooks/useSocket";
import { io, Socket } from "socket.io-client";
import { deleteRoom } from "@/services/room/deleteRoom";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
  ],
};

type Props = {
  roomId: string;
  user?: User | null;
  participant?: User | null;
  isUsersRoom?: boolean;
};

export default function Room({
  roomId,
  user,
  participant,
  isUsersRoom,
}: Props) {
  useSocket();

  const router = useRouter();
  const userVideoRef: RefObject<HTMLVideoElement> =
    useRef<HTMLVideoElement>(null);
  const peerVideoRef: RefObject<HTMLVideoElement> =
    useRef<HTMLVideoElement>(null);
  const rtcConnectionRef: MutableRefObject<any> = useRef<any>(null);
  const socketRef: MutableRefObject<Socket | null> = useRef<Socket | null>(
    null
  );
  const userStreamRef: MutableRefObject<MediaStream | undefined> =
    useRef<MediaStream>();
  const hostRef: MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC__SOCKET_SERVER as string, {
      withCredentials: true, // If using credentials like cookies
      extraHeaders: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC__URL as string, // Match your server's allowed origin
      },
    });
    // First we join a room
    socketRef.current.emit("join", roomId);

    socketRef.current.on("joined", handleRoomJoined);
    // If the room didn't exist, the server would emit the room was 'created'
    socketRef.current.on("created", handleRoomCreated);
    // Whenever the next person joins, the server emits 'ready'
    socketRef.current.on("ready", initiateCall);

    // Emitted when a peer leaves the room
    socketRef.current.on("leave", onPeerLeave);

    // If the room is full, we show an alert
    socketRef.current.on("full", () => {
      window.location.href = "/";
    });

    // Event called when a remote user initiating the connection and
    socketRef.current.on("offer", handleReceivedOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice-candidate", handlerNewIceCandidateMsg);

    // clear up after
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        (userVideoRef.current as any).srcObject = stream;
        (userVideoRef.current as any).onloadedmetadata = () => {
          (userVideoRef.current as any).play();
        };
        (socketRef.current as any).emit("ready", roomId);
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  };

  const handleRoomCreated = () => {
    hostRef.current = true;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream;
        (userVideoRef.current as any).srcObject = stream;
        (userVideoRef.current as any).onloadedmetadata = () => {
          (userVideoRef.current as any).play();
        };
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  };

  const initiateCall = () => {
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      rtcConnectionRef.current.addTrack(
        (userStreamRef.current as any)?.getTracks()[0],
        userStreamRef.current
      );
      rtcConnectionRef.current.addTrack(
        (userStreamRef.current as any)?.getTracks()[1],
        userStreamRef.current
      );
      rtcConnectionRef.current
        .createOffer()
        .then((offer: RTCSessionDescriptionInit) => {
          rtcConnectionRef.current.setLocalDescription(offer);
          (socketRef.current as any).emit("offer", offer, roomId);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const onPeerLeave = () => {
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true;
    if ((peerVideoRef.current as any).srcObject) {
      (peerVideoRef.current as any).srcObject
        .getTracks()
        .forEach((track: MediaStreamTrack) => {
          track.stop();
        }); // Stops receiving all track of Peer.
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      rtcConnectionRef.current.addTrack(
        (userStreamRef.current as any).getTracks()[0],
        userStreamRef.current
      );
      rtcConnectionRef.current.addTrack(
        (userStreamRef.current as any).getTracks()[1],
        userStreamRef.current
      );
      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current
        .createAnswer()
        .then((answer: RTCSessionDescription) => {
          rtcConnectionRef.current.setLocalDescription(answer);
          (socketRef.current as any).emit("answer", answer, roomId);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    rtcConnectionRef.current
      .setRemoteDescription(answer)
      .catch((err: any) => console.log(err));
  };

  const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      (socketRef.current as any).emit("ice-candidate", event.candidate, roomId);
    }
  };

  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidateInit) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log(e));
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    (peerVideoRef.current as any).srcObject = event.streams[0];
  };

  const leaveRoom = () => {
    (socketRef.current as any).emit("leave", roomId); // Let's the server know that user has left the room.

    if (userVideoRef?.current?.srcObject) {
      (userVideoRef.current?.srcObject as any)
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop()); // Stops receiving all track of User.
    }
    if (peerVideoRef?.current?.srcObject) {
      (peerVideoRef.current.srcObject as any)
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop()); // Stops receiving audio track of Peer.
    }

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }

    if (isUsersRoom) {
      // deleteRoom(user.tgNickname).then(() => {
      //   router.push("/");
      // });
      router.push("/");
    } else {
      router.push("/");
    }
  };

  const likeParticipant = () => {
    if (user?.tgNickname && participant?.tgNickname) {
      likeUser(user?.tgNickname, participant?.tgNickname).then(() => {
        router.push(
          `/success?name=${participant.name}&avatar=${participant.avatar}`
        );
      });
    }
  };

  return (
    <section className="relative h-[90vh] flex justify-center mt-50">
      <div className="absolute z-10 top-10 right-3 md:hidden">
        <div className={userVideoRef ? " " : "animate-pulse"}>
          <video
            className="h-20 border border-pink-400 rounded-2xl w-[106px] bg-pink-400"
            autoPlay
            ref={userVideoRef}
          />
        </div>
      </div>
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="inline-flex">
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24 flex justify-center items-center"
          >
            <Image
              src={"/icons/close.svg"}
              width={20}
              height={20}
              alt="close"
            />
          </button>
          <button
            onClick={likeParticipant}
            className="px-4 py-2 bg-green-400  rounded-r-md w-24 flex justify-center items-center"
          >
            <Image src={"/icons/like.svg"} width={20} height={20} alt="like" />
          </button>
        </div>
      </div>
      <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
        {participant ? participant.name : <Spinner />}
      </h4>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {peerVideoRef ? (
          <video
            className="fixed top-2 left-0 w-full h-full object-cover"
            ref={peerVideoRef}
            autoPlay
          />
        ) : (
          <Spinner />
        )}
      </div>
    </section>
  );
}
