import { MutableRefObject, RefObject } from "react";
import { Socket } from "socket.io-client";

export const cleanupWebRTCResources = (
  userVideoRef: RefObject<HTMLVideoElement>,
  peerVideoRef: RefObject<HTMLVideoElement>,
  rtcConnectionRef: MutableRefObject<any>,
  userStreamRef: MutableRefObject<MediaStream | undefined>,
  socketRef: MutableRefObject<Socket | null>,
  roomId?: string
) => {
  if (userStreamRef.current) {
    userStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });
    userStreamRef.current = undefined;
  }

  if (peerVideoRef?.current?.srcObject) {
    (peerVideoRef.current.srcObject as MediaStream)
      .getTracks()
      .forEach((track: MediaStreamTrack) => {
        track.stop();
      });
  }

  if (userVideoRef?.current?.srcObject) {
    (userVideoRef.current.srcObject as MediaStream)
      .getTracks()
      .forEach((track: MediaStreamTrack) => {
        track.stop();
      });
  }

  if (userVideoRef?.current) {
    userVideoRef.current.srcObject = null;
  }
  if (peerVideoRef?.current) {
    peerVideoRef.current.srcObject = null;
  }

  if (rtcConnectionRef.current) {
    rtcConnectionRef.current.ontrack = null;
    rtcConnectionRef.current.onicecandidate = null;
    rtcConnectionRef.current.close();
    rtcConnectionRef.current = null;
  }

  if (socketRef.current && roomId) {
    socketRef.current.emit("leave", roomId);
  }
}; 