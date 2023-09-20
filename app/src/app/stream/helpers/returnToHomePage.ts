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

  exitFromPage(id)
    .then(() => {
      if (socket.current) {
        socket.current.emit("checkControls", {
          isSmashed: false,
          isExited: true,
          isPassed: false,
        });

        socket.current.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
    })
    .then(() => router.push("/"));
}
