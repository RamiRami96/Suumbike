// TODO: need to decompose component

"use client";

import { useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import Peer from "simple-peer";

import { Spinner } from "../../components/spinner";
import { getUsers } from "./actions/getUsers";
import { likeUser } from "./actions/likeUser";
import { exitFromPage } from "./actions/exitFromPage";

import type { User } from "../types/user";
import FrontCamera from "./frontCamera";

type StreamProps = {};

export default function StreamPage(props: StreamProps) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [visitedUsers, setVisitedUsers] = useState<User[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(12000);
  const [usersData, setUsersData] = useState<{
    user: User;
    users: User[];
  } | null>(null);

  const [userID, setUserID] = useState<string>("");
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [connectionAccepted, setConnectionAccepted] = useState<boolean>(false);

  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>();

  const tgNickname: string | undefined = (session.data?.user as any)
    ?.tgNickname;

  const NOT_USERS: boolean = usersData?.users?.length === 0;

  const user: User | undefined = usersData?.user;

  function getCandidate(users?: User[], user?: User): void {
    if (users?.length && user) {
      setIsLoading(true);

      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (users.length - visitedUsers.length === 0) {
        setCandidate(null);
        return;
      } else if (
        visitedUsers.some(
          ({ tgNickname }) => tgNickname === randomUser.tgNickname
        )
      ) {
        return getCandidate(users, user);
      }

      setCandidate(randomUser);
      setIsLoading(false);
    }

    return;
  }

  function onSmash(users?: User[], user?: User) {
    setUsersData(null);
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (socket.current) {
      socket.current.disconnect();
    }
    setTimeLeft(120);
    if (users) {
      return getCandidate(users, user);
    }
  }

  async function onPass(user?: User, candidate?: User | null) {
    setIsLoading(true);

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (socket.current) {
      socket.current.disconnect();
    }

    if (user && candidate) {
      try {
        await likeUser(user.id, candidate.id);
        router.push(
          `/success?name=${candidate.name}&avatar=${candidate.avatar}`
        );
      } catch (error) {
        console.log("Error while liking user:", error);
        setIsLoading(false);
      }
    }

    return;
  }

  useEffect(() => {
    if (candidate) setVisitedUsers([...visitedUsers, candidate]);
  }, [candidate]);

  useEffect(() => {
    if (!NOT_USERS) {
      getCandidate(usersData?.users, usersData?.user);
    }
  }, [usersData?.users, usersData?.user]);

  useEffect(() => {
    if (timeLeft === 0) {
      onPass(user, candidate);
    }

    if (isLoading || !candidate || NOT_USERS || !connectionAccepted) return;

    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  }, [connectionAccepted]);

  const minute: number = Math.floor(timeLeft / 60);
  const second: number = timeLeft % 60;

  function returnToHomePage(id?: string) {
    if (!id || !stream || !socket.current) return;
    stream.getTracks().forEach((track) => track.stop());
    socket.current.disconnect();
    exitFromPage(id).then(() => router.push("/"));
  }

  useEffect(() => {
    if (!tgNickname || usersData) return;

    getUsers(tgNickname).then((data) => {
      if (data) setUsersData(data);
    });
  }, [tgNickname, usersData]);

  useEffect(() => {
    socket.current = io("http://localhost:8000");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });

    socket.current.on("userID", (id: string) => {
      setUserID(id);
    });
    socket.current.on("allUsers", (u: { [key: string]: any }) => {
      if (Object.keys(users).length < 3) {
        setUsers(u);
      }
    });

    socket.current.on("init", (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    Object.keys(users).map((key) => {
      if (key === userID) {
        return null;
      }

      callPeer(key);
    });
  }, [users]);

  useEffect(() => {
    if (receivingCall) {
      acceptConnection();
    }
  }, [receivingCall]);

  function callPeer(id: string) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: stream as MediaStream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("connectUser", {
        userToCall: id,
        signalData: data,
        from: userID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("connectionAccepted", (signal: any) => {
      setConnectionAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptConnection() {
    setConnectionAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream as MediaStream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("acceptConnection", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let PartnerVideo;
  if (connectionAccepted) {
    PartnerVideo = (
      <video
        className="fixed top-2 left-0 w-full h-full object-cover"
        ref={partnerVideo}
        autoPlay
        muted
      />
    );
  }

  return (
    <section className="relative h-[90vh] flex justify-center mt-50">
      <time
        aria-live="assertive"
        className="absolute z-10 top-12 left-3 text-2xl font-bold text-pink-400 md:hidden w-8 "
      >
        {`${minute}:${second.toString().padStart(2, "0")}`}
      </time>
      <div className="absolute z-10 top-10 right-3 md:hidden">
        <FrontCamera />
      </div>
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="hidden md:block w-[55px]">
          <time className="text-2xl font-bold text-pink-400">
            {`${minute}:${second.toString().padStart(2, "0")}`}
          </time>
        </div>
        <div className="inline-flex">
          <button
            className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24"
            onClick={() => onSmash(usersData?.users, usersData?.user)}
            disabled={isLoading || !candidate || NOT_USERS}
          >
            Smash
          </button>
          <button
            className="px-4 py-2 bg-white text-pink-400 border-2 border-t-pink-400 border-b-pink-400 w-24"
            onClick={() => returnToHomePage(user?.id)}
          >
            Exit
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-r-md w-24"
            onClick={() => onPass(user, candidate)}
            disabled={isLoading || !candidate || NOT_USERS}
          >
            Pass
          </button>
        </div>
        <div className="hidden md:block">
          <FrontCamera />
        </div>
      </div>
      {candidate?.name && (
        <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
          {candidate?.name}
        </h4>
      )}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {!isLoading && candidate && connectionAccepted ? (
          <div className={connectionAccepted ? " " : "animate-pulse"}>
            {PartnerVideo}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </section>
  );
}
