import { useRef, useEffect, MutableRefObject, RefObject } from "react";
import { io, Socket } from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:openrelay.metered.ca:80",
    },
  ],
};

export function useWebRTC(roomId: string) {
  const userVideoRef: RefObject<HTMLVideoElement> = useRef<HTMLVideoElement>(null);
  const peerVideoRef: RefObject<HTMLVideoElement> = useRef<HTMLVideoElement>(null);
  const rtcConnectionRef: MutableRefObject<any> = useRef<any>(null);
  const socketRef: MutableRefObject<Socket | null> = useRef<Socket | null>(null);
  const userStreamRef: MutableRefObject<MediaStream | undefined> = useRef<MediaStream>();
  const hostRef: MutableRefObject<boolean> = useRef(false);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        userStreamRef.current = stream;
        (userVideoRef.current as any).srcObject = stream;
        (userVideoRef.current as any).onloadedmetadata = () => {
          (userVideoRef.current as any).play();
        };
        (socketRef.current as any).emit("ready", roomId);
      })
      .catch((err) => {
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
        userStreamRef.current = stream;
        (userVideoRef.current as any).srcObject = stream;
        (userVideoRef.current as any).onloadedmetadata = () => {
          (userVideoRef.current as any).play();
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
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
    hostRef.current = true;
    if ((peerVideoRef.current as any).srcObject) {
      (peerVideoRef.current as any).srcObject
        .getTracks()
        .forEach((track: MediaStreamTrack) => {
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
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log(e));
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    (peerVideoRef.current as any).srcObject = event.streams[0];
  };

  const cleanupConnections = () => {
    if (userVideoRef?.current?.srcObject) {
      (userVideoRef.current?.srcObject as any)
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
    }
    if (peerVideoRef?.current?.srcObject) {
      (peerVideoRef.current.srcObject as any)
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
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
