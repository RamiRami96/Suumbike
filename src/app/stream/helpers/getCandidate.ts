import { Dispatch, MutableRefObject } from "react";
import io from "socket.io-client";
import { ActionTypes } from "../state/actions";
import { User } from "@/app/types/user";

export function getCandidate(
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>,
  visitedUsers: User[],
  socket: MutableRefObject<any>,
  users?: User[],
  user?: User
): void {
  if (users?.length && user) {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });

    const randomUser = users[Math.floor(Math.random() * users.length)];

    if (users.length - visitedUsers.length === 0) {
      dispatch({ type: ActionTypes.SET_CANDIDATE, payload: null });

      return;
    } else if (
      visitedUsers.some(
        ({ tgNickname }) => tgNickname === randomUser.tgNickname
      )
    ) {
      return getCandidate(dispatch, visitedUsers, socket, users, user);
    }

    socket.current = io(process.env.NEXT_PUBLIC__SOCKET_SERVER as string);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        dispatch({ type: ActionTypes.SET_STREAM, payload: stream });
      });

    socket.current.on("socketID", (id: string) => {
      dispatch({ type: ActionTypes.SET_SOCKET_ID, payload: id });
    });
    socket.current.on("allUsers", (user: { [key: string]: any }) => {
      if (Object.keys(users).length < 3) {
        dispatch({ type: ActionTypes.SET_USERS, payload: user });
      }
    });

    socket.current.on("init", (data: any) => {
      dispatch({ type: ActionTypes.SET_RECEIVING_CALL, payload: true });
      dispatch({ type: ActionTypes.SET_CALLER, payload: data.from });
      dispatch({ type: ActionTypes.SET_CALLER_SIGNAL, payload: data.signal });
    });

    dispatch({ type: ActionTypes.SET_CANDIDATE, payload: randomUser });
    dispatch({ type: ActionTypes.SET_LOADING, payload: false });
  }

  return;
}
