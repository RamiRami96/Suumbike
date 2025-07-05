import { useState, useEffect, useRef, MutableRefObject } from "react";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import { User } from "@/models/user";
import { useWebRTC } from "./useWebRTC";

export function useRoomSocket(roomId: string) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [participant, setParticipant] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isExited, setIsExited] = useState(false);

  // Initialize WebRTC
  const webRTC = useWebRTC(roomId);

  useEffect(() => {
    const { io } = require("socket.io-client");
    
    webRTC.socketRef.current = io(process.env.NEXT_PUBLIC__SOCKET_SERVER as string, {
      withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC__URL as string,
      },
    });

    const socket = webRTC.socketRef.current;
    if (!socket) return;

    socket.emit("join", roomId);

    socket.on("joined", webRTC.handleRoomJoined);
    socket.on("created", webRTC.handleRoomCreated);
    socket.on("ready", webRTC.initiateCall);
    socket.on("leave", webRTC.onPeerLeave);
    socket.on("full", () => {
      router.push("/");
    });
    socket.on("offer", webRTC.handleReceivedOffer);
    socket.on("answer", webRTC.handleAnswer);
    socket.on("ice-candidate", webRTC.handlerNewIceCandidateMsg);

    return () => {
      if (webRTC.socketRef.current) {
        webRTC.socketRef.current.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, router]);

  useEffect(() => {
    if (webRTC.socketRef?.current) {
      webRTC.socketRef.current.on(
        "checkControls",
        (data: { isExited: boolean; isLiked: boolean }) => {
          setIsLiked(data.isLiked);
          setIsExited(data.isExited);
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webRTC.socketRef?.current]);

  useEffect(() => {
    if (webRTC.socketRef?.current) {
      webRTC.socketRef.current.on("users", (usersData: User[]) => {
        setUsers(usersData);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webRTC.socketRef?.current]);

  const emitCheckControls = (isExited: boolean, isLiked: boolean) => {
    (webRTC.socketRef.current as any).emit("checkControls", {
      isExited,
      isLiked,
    });
  };

  const emitLeave = () => {
    (webRTC.socketRef.current as any).emit("leave", roomId);
  };

  const updateUsers = (user: User, currentUsers: User[]) => {
    if (
      currentUsers.length < 3 &&
      user &&
      !currentUsers.some((value) => user.name === value.name)
    ) {
      const newUsers = [...currentUsers, user];
      setUsers(newUsers);
      webRTC.socketRef.current?.emit("users", newUsers);
      
      const filteredData = newUsers.filter((u) => u.name !== user.name);
      setParticipant(filteredData[0]);
    }
  };

  return {
    webRTC,
    users,
    participant,
    isLiked,
    isExited,
    setUsers,
    setParticipant,
    emitCheckControls,
    emitLeave,
    updateUsers,
  };
}
