import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { likeUser } from "@/modules/profile/services/likeUser";
import { deleteRoom } from "@/modules/room/services/deleteRoom";
import { User } from "@/shared/models/user";

export function useRoomActions(
  roomId: string,
  isUsersRoom?: boolean,
  user?: User,
  participant?: User | null,
  cleanupConnections?: () => void,
  emitLeave?: () => void,
  emitCheckControls?: (isExited: boolean, isLiked: boolean) => void
) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const leaveRoom = useCallback(() => {
    setIsLoading(true);

    emitLeave?.();
    emitCheckControls?.(true, false);
    cleanupConnections?.();

    if (isUsersRoom && user?.tgNickname) {
      deleteRoom(user.tgNickname).then(() => {
        router.push("/");
      });
    } else {
      router.push("/");
    }
  }, [isUsersRoom, user, cleanupConnections, emitLeave, emitCheckControls, router]);

  const likeParticipant = useCallback(() => {
    setIsLoading(true);

    emitLeave?.();
    emitCheckControls?.(false, true);
    cleanupConnections?.();

    if (user?.tgNickname && participant?.tgNickname) {
      likeUser(user.tgNickname, participant.tgNickname).then(() => {
        if (isUsersRoom && user.tgNickname) {
          deleteRoom(user.tgNickname).then(() => {
            router.push(
              `/success?name=${participant?.name}&avatar=${participant?.avatar}`
            );
          });
        } else {
          router.push(
            `/success?name=${participant?.name}&avatar=${participant?.avatar}`
          );
        }
      });
    }
  }, [user, participant, isUsersRoom, cleanupConnections, emitLeave, emitCheckControls, router]);

  return {
    isLoading,
    leaveRoom,
    likeParticipant,
  };
}
