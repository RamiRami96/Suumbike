import { MutableRefObject, RefObject, useCallback, useEffect, useRef, useState, useContext } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { deleteRoom } from "@/modules/room/services/deleteRoom";
import { likeUser } from "@/modules/profile/services/likeUser";
import { User } from "@/shared/models/user";
import { NotificationContext } from "@/modules/layout/context/notificationContext";
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from "@/modules/layout/const/notificationContext.const";
import { cleanupWebRTCResources } from "@/shared/heplers/cleanupWebRTC";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:openrelay.metered.ca:80" }],
};

export const useVideoRoom = (roomId: string, isUsersRoom?: boolean) => {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const user = session.data?.user;
  const { showNotification } = useContext(NotificationContext);

  const [participant, setParticipant] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleICECandidateEvent = useCallback((event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      (socketRef.current as any).emit("ice-candidate", event.candidate, roomId);
    }
  }, [roomId]);

  const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
    (peerVideoRef.current as any).srcObject = event.streams[0];
  }, []);

  const createPeerConnection = useCallback(() => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;

    return connection;
  }, [handleICECandidateEvent, handleTrackEvent]);

  const handleRoomJoined = useCallback(() => {
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
  }, [roomId]);

  const handleRoomCreated = useCallback(() => {
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
  }, []);

  const initiateCall = useCallback(() => {
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
  }, [roomId, createPeerConnection]);

  const onPeerLeave = useCallback(() => {
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
  }, []);

  const handleReceivedOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      
      // Check if user stream is available and has tracks
      if (userStreamRef.current && userStreamRef.current.getTracks().length > 0) {
        const tracks = userStreamRef.current.getTracks();
        
        // Add video track if available
        const videoTrack = tracks.find(track => track.kind === 'video');
        if (videoTrack) {
          rtcConnectionRef.current.addTrack(videoTrack, userStreamRef.current);
        }
        
        // Add audio track if available
        const audioTrack = tracks.find(track => track.kind === 'audio');
        if (audioTrack) {
          rtcConnectionRef.current.addTrack(audioTrack, userStreamRef.current);
        }
      } else {
        console.warn('User stream not available when handling offer');
        // If stream is not ready, we might need to wait for it
        // For now, we'll proceed without tracks and let the connection establish
      }
      
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
  }, [roomId, createPeerConnection]);

  const handleAnswer = useCallback((answer: RTCSessionDescriptionInit) => {
    rtcConnectionRef.current
      .setRemoteDescription(answer)
      .catch((err: any) => console.log(err));
  }, []);

  const handlerNewIceCandidateMsg = useCallback((incoming: RTCIceCandidateInit) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log(e));
  }, []);

    // Handle browser beforeunload event to show confirmation when user tries to close tab or navigate away
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave the room?";
        return "Are you sure you want to leave the room?";
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, []);

  // Cleanup effect that runs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all WebRTC resources when component unmounts
      cleanupWebRTCResources(
        userVideoRef,
        peerVideoRef,
        rtcConnectionRef,
        userStreamRef,
        socketRef,
        roomId
      );
    };
  }, [roomId]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC__SOCKET_SERVER as string, {
      withCredentials: true,
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
      showNotification(NOTIFICATION_MESSAGES.room_full, NOTIFICATION_TYPES.room_full);
      router.push("/");
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
  }, [roomId, router, handleRoomJoined, handleRoomCreated, initiateCall, onPeerLeave, handleReceivedOffer, handleAnswer, handlerNewIceCandidateMsg, showNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (participant && isBtnDisabled) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        if (seconds === 10) {
          setIsBtnDisabled(false);
        }
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [participant, isBtnDisabled, seconds]);

  const leaveRoom = useCallback(() => {
    setIsLoading(true);

    (socketRef.current as any).emit("leave", roomId); // Let's the server know that user has left the room.

    (socketRef.current as any).emit("checkControls", {
      isExited: true,
      isLiked: false,
    });

    cleanupWebRTCResources(
      userVideoRef,
      peerVideoRef,
      rtcConnectionRef,
      userStreamRef,
      socketRef,
      roomId
    );

    showNotification(NOTIFICATION_MESSAGES.connection_rejected, NOTIFICATION_TYPES.connection_rejected);
    if (isUsersRoom && (user as User)?.tgNickname) {
      deleteRoom((user as User).tgNickname).then(() => {
        router.push("/");
      });
    } else {
      router.push("/");
    }
  }, [roomId, isUsersRoom, user, router, showNotification]);

  const likeParticipant = useCallback(() => {
    setIsLoading(true);

    (socketRef.current as any).emit("leave", roomId); // Let's the server know that user has left the room.

    (socketRef.current as any).emit("checkControls", {
      isExited: false,
      isLiked: true,
    });

    // Use the helper function to clean up resources
    cleanupWebRTCResources(
      userVideoRef,
      peerVideoRef,
      rtcConnectionRef,
      userStreamRef,
      socketRef,
      roomId
    );

    if ((user as User)?.tgNickname && participant?.tgNickname) {
      likeUser((user as User)?.tgNickname, participant?.tgNickname).then(() => {
        showNotification(NOTIFICATION_MESSAGES.connection_success, NOTIFICATION_TYPES.connection_success);
        if (isUsersRoom && (user as User)?.tgNickname) {
          deleteRoom((user as User).tgNickname).then(() => {
            router.push("/profile");
          });
        } else {
          router.push("/profile");
        }
      });
    }
  }, [roomId, isUsersRoom, user, participant, router, showNotification]);

  useEffect(() => {
    if (socketRef?.current) {
      socketRef.current.on(
        "checkControls",
        (data: { isExited: boolean; isLiked: boolean }) => {
          setIsLiked(data.isLiked);
          setIsExited(data.isExited);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isLiked && !isLoading) {
      likeParticipant();
    }

    if (isExited && !isLoading) {
      leaveRoom();
    }
  }, [isLiked, isExited, isLoading, leaveRoom, likeParticipant]);

  useEffect(() => {
    if (socketRef?.current) {
      socketRef.current.on("users", (usersData: User[]) => {
        if (users.length < 3 && user) {
          setUsers(usersData);
          const filteredData = usersData.filter((u) => u.name !== user.name);
          setParticipant(filteredData[0]);
        }
      });

      if (
        users.length < 3 &&
        user &&
        !users.some((value) => user.name === value.name)
      ) {
        socketRef.current.emit("users", [...users, user]);
      }
    }
  }, [user, users]);

  return {
    userVideoRef,
    peerVideoRef,
    participant,
    leaveRoom,
    likeParticipant,
    isBtnDisabled,
    isLoading,
  };
};