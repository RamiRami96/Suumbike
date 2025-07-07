import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { User } from "@/shared/models/user";
import { useWebRTC } from "./useWebRTC";

export function useRoomSocket(roomId: string) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [participant, setParticipant] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isExited, setIsExited] = useState(false);

  const webRTC = useWebRTC(roomId);

  const handleCheckControls = useCallback((data: { isExited: boolean; isLiked: boolean }) => {
    setIsLiked(data.isLiked);
    setIsExited(data.isExited);
  }, []);

  const handleUsers = useCallback((usersData: User[]) => {
    setUsers(usersData);
  }, []);

  const handleRoomFull = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
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
    socket.on("full", handleRoomFull);
    socket.on("offer", webRTC.handleReceivedOffer);
    socket.on("answer", webRTC.handleAnswer);
    socket.on("ice-candidate", webRTC.handlerNewIceCandidateMsg);
    socket.on("checkControls", handleCheckControls);
    socket.on("users", handleUsers);

    return () => {
      if (webRTC.socketRef.current) {
        const socket = webRTC.socketRef.current;
        socket.off("joined", webRTC.handleRoomJoined);
        socket.off("created", webRTC.handleRoomCreated);
        socket.off("ready", webRTC.initiateCall);
        socket.off("leave", webRTC.onPeerLeave);
        socket.off("full", handleRoomFull);
        socket.off("offer", webRTC.handleReceivedOffer);
        socket.off("answer", webRTC.handleAnswer);
        socket.off("ice-candidate", webRTC.handlerNewIceCandidateMsg);
        socket.off("checkControls", handleCheckControls);
        socket.off("users", handleUsers);
        
        socket.disconnect();
      }
    };
  }, [roomId, webRTC, handleCheckControls, handleUsers, handleRoomFull]);

  const emitCheckControls = useCallback((isExited: boolean, isLiked: boolean) => {
    webRTC.socketRef.current?.emit("checkControls", {
      isExited,
      isLiked,
    });
  }, [webRTC.socketRef]);

  const emitLeave = useCallback(() => {
    webRTC.socketRef.current?.emit("leave", roomId);
  }, [webRTC.socketRef, roomId]);

  const updateUsers = useCallback((user: User, currentUsers: User[]) => {
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
  }, [webRTC.socketRef]);

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
