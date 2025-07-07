import { useRef, useEffect, MutableRefObject, RefObject } from "react";
import { io, Socket } from "socket.io-client";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
  ],
};

const MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: true,
};

export function useWebRTC(roomId: string) {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const userStreamRef = useRef<MediaStream | undefined>(undefined);
  const hostRef = useRef<boolean>(false);

  const setupUserMedia = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
      userStreamRef.current = stream;
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current?.play();
        };
      }
    } catch (error) {
      console.error("Failed to get user media:", error);
    }
  };

  const handleRoomJoined = async (): Promise<void> => {
    await setupUserMedia();
    socketRef.current?.emit("ready", roomId);
  };

  const handleRoomCreated = async (): Promise<void> => {
    hostRef.current = true;
    await setupUserMedia();
  };

  const createPeerConnection = (): RTCPeerConnection => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const addTracksToConnection = (connection: RTCPeerConnection): void => {
    if (!userStreamRef.current) return;
    
    const tracks = userStreamRef.current.getTracks();
    tracks.forEach(track => {
      if (userStreamRef.current) {
        connection.addTrack(track, userStreamRef.current);
      }
    });
  };

  const initiateCall = (): void => {
    if (!hostRef.current) return;

    rtcConnectionRef.current = createPeerConnection();
    addTracksToConnection(rtcConnectionRef.current);

    rtcConnectionRef.current
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) => {
        rtcConnectionRef.current?.setLocalDescription(offer);
        socketRef.current?.emit("offer", offer, roomId);
      })
      .catch((error: any) => {
        console.error("Failed to create offer:", error);
      });
  };

  const onPeerLeave = (): void => {
    hostRef.current = true;
    
    if (peerVideoRef.current?.srcObject) {
      const stream = peerVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit): void => {
    if (hostRef.current) return;

    rtcConnectionRef.current = createPeerConnection();
    addTracksToConnection(rtcConnectionRef.current);
    rtcConnectionRef.current.setRemoteDescription(offer);

    rtcConnectionRef.current
      .createAnswer()
      .then((answer: RTCSessionDescriptionInit) => {
        rtcConnectionRef.current?.setLocalDescription(answer);
        socketRef.current?.emit("answer", answer, roomId);
      })
      .catch((error: any) => {
        console.error("Failed to create answer:", error);
      });
  };

  const handleAnswer = (answer: RTCSessionDescriptionInit): void => {
    rtcConnectionRef.current
      ?.setRemoteDescription(answer)
      .catch((err: any) => console.error("Failed to set remote description:", err));
  };

  const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent): void => {
    if (event.candidate) {
      socketRef.current?.emit("ice-candidate", event.candidate, roomId);
    }
  };

  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidateInit): void => {
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      ?.addIceCandidate(candidate)
      .catch((e: any) => console.error("Failed to add ICE candidate:", e));
  };

  const handleTrackEvent = (event: RTCTrackEvent): void => {
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = event.streams[0];
    }
  };

  const cleanupConnections = (): void => {
    if (userVideoRef.current?.srcObject) {
      const userStream = userVideoRef.current.srcObject as MediaStream;
      userStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }

    if (peerVideoRef.current?.srcObject) {
      const peerStream = peerVideoRef.current.srcObject as MediaStream;
      peerStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }

    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = null;
    }
  };

  return {
    userVideoRef,
    peerVideoRef,
    socketRef,
    userStreamRef,
    hostRef,
    rtcConnectionRef,
    handleRoomJoined,
    handleRoomCreated,
    initiateCall,
    onPeerLeave,
    handleReceivedOffer,
    handleAnswer,
    handleICECandidateEvent,
    handlerNewIceCandidateMsg,
    handleTrackEvent,
    cleanupConnections,
  };
}
