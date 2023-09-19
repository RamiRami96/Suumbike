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

  if (stream) {
    stream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
  if (!socket) return;

  if (socket.current) {
    socket.current.disconnect();
  }
  dispatch({
    type: ActionTypes.SET_TIME_LEFT,
    payload: 120,
  });
  if (users) {
    return getCandidate(dispatch, visitedUsers, socket, users, user);
  }
}
