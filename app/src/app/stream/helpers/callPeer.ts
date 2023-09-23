import { Dispatch, MutableRefObject } from "react";
import Peer from "simple-peer";
import { ActionTypes } from "../state/actions";

export function callPeer(
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>,
  id: string,
  socket: MutableRefObject<any>,
  socketID: string,
  stream?: MediaStream | null,
  partnerVideo?: MutableRefObject<HTMLVideoElement | null>
) {
  const peer = new Peer({
    initiator: true,
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
      to: id,
      signalData: data,
      from: socketID,
    });
  });

  peer.on("stream", (stream) => {
    if (partnerVideo && partnerVideo.current) {
      partnerVideo.current.srcObject = stream;
    }
  });

  socket.current.on("connectionAccepted", (signal: any) => {
    dispatch({ type: ActionTypes.SET_CONNECTION_ACCEPTED, payload: true });
    peer.signal(signal);
  });
}
