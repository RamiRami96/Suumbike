import { Dispatch, MutableRefObject } from "react";
import { ActionTypes } from "../state/actions";
import { User } from "@/app/types/user";

export function onSmash(
  getCandidate: (
    dispatch: Dispatch<{
      type: ActionTypes;
      payload: any;
    }>,
    visitedUsers: User[],
    socket: MutableRefObject<any>,
    users?: User[],
    user?: User
  ) => void,
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>,
  visitedUsers: User[],
  socket: MutableRefObject<any>,
  users?: User[],
  user?: User,
  stream?: MediaStream | null
) {
  dispatch({ type: ActionTypes.SET_USERS_DATA, payload: null });
  dispatch({ type: ActionTypes.SET_CONNECTION_ACCEPTED, payload: false });

  if (!socket) return;

  if (socket.current) {
    socket.current.emit("checkControls", {
      isSmashed: true,
      isExited: false,
      isPassed: false,
    });
    socket.current.disconnect();
  }

  if (stream) {
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });
  }

  dispatch({
    type: ActionTypes.SET_TIME_LEFT,
    payload: 1200,
  });
  if (users) {
    return getCandidate(dispatch, visitedUsers, socket, users, user);
  }
}
