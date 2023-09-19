import { Dispatch, MutableRefObject } from "react";
import { ActionTypes } from "../state/actions";
import { likeUser } from "../actions/likeUser";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { User } from "@/app/types/user";

export async function onPass(
  router: AppRouterInstance,
  dispatch: Dispatch<{
    type: ActionTypes;
    payload: any;
  }>,
  socket: MutableRefObject<any>,
  user?: User,
  candidate?: User | null,
  stream?: MediaStream | null
) {
  dispatch({ type: ActionTypes.SET_LOADING, payload: true });

  if (stream) {
    stream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
  if (!socket) return;

  if (socket.current) {
    socket.current.disconnect();
  }

  if (user && candidate) {
    try {
      await likeUser(user.id, candidate.id);
      router.push(`/success?name=${candidate.name}&avatar=${candidate.avatar}`);
    } catch (error) {
      console.log("Error while liking user:", error);
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }

  return;
}
