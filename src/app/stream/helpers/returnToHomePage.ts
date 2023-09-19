import { MutableRefObject } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { exitFromPage } from "../actions/exitFromPage";

export function returnToHomePage(
  router: AppRouterInstance,
  socket: MutableRefObject<any>,
  id?: string,
  stream?: MediaStream | null
) {
  if (!id) return;

  exitFromPage(id).then(() => router.push("/"));

  if (stream) {
    stream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }

  if (socket.current) {
    socket.current.disconnect();
  }
}
