import { Dispatch, MutableRefObject } from "react";
import Peer, { SignalData } from "simple-peer";
import { ActionTypes } from "../state/actions";

export function acceptConnection(
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>,
  socket: MutableRefObject<any>,
  partnerVideo: MutableRefObject<HTMLVideoElement | null>,
  caller: string,
  callerSignal: string | SignalData,
  stream?: MediaStream
) {
  dispatch({ type: ActionTypes.SET_CONNECTION_ACCEPTED, payload: true });

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
