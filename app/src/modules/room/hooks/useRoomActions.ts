import { useState, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { likeUser } from "@/modules/profile/services/likeUser";
import { deleteRoom } from "@/modules/room/services/deleteRoom";
import { User } from "@/shared/models/user";
import { NotificationContext } from "@/modules/layout/context/notificationContext";
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from "@/modules/layout/const/notificationContext.const";

export function useRoomActions(
  isUsersRoom?: boolean,
  user?: User,
  participant?: User | null,
  cleanupConnections?: () => void,
  emitLeave?: () => void,
  emitCheckControls?: (isExited: boolean, isLiked: boolean) => void
) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useContext(NotificationContext);

  const leaveRoom = useCallback(() => {
    setIsLoading(true);

    emitLeave?.();
    emitCheckControls?.(true, false);
    
    if (cleanupConnections) {
      try {
        cleanupConnections();
      } catch (error) {
        console.error('Error calling cleanup function:', error);
      }
    }
    
    setTimeout(() => {
      if (isUsersRoom && user?.tgNickname) {
        deleteRoom(user.tgNickname).then(() => {
          router.push("/");
          showNotification(NOTIFICATION_MESSAGES.owner_reject, NOTIFICATION_TYPES.owner_reject);
        });
      } else {
        router.push("/");
        showNotification(NOTIFICATION_MESSAGES.opponent_reject, NOTIFICATION_TYPES.opponent_reject);
      }
    }, 500);
  }, [isUsersRoom, user, cleanupConnections, emitLeave, emitCheckControls, router, showNotification]);

  const likeParticipant = useCallback(() => {
    setIsLoading(true);

    emitLeave?.();
    emitCheckControls?.(false, true);
    cleanupConnections?.();

    if (user?.tgNickname && participant?.tgNickname) {
      likeUser(user.tgNickname, participant.tgNickname).then(() => {
        if (isUsersRoom && user.tgNickname) {
          deleteRoom(user.tgNickname).then(() => {
            router.push("/profile");
            showNotification(NOTIFICATION_MESSAGES.owner_pass, NOTIFICATION_TYPES.owner_pass);
          });
        } else {
          router.push("/profile");
          showNotification(NOTIFICATION_MESSAGES.opponent_pass, NOTIFICATION_TYPES.opponent_pass);
        }
      });
    }
  }, [user, participant, isUsersRoom, cleanupConnections, emitLeave, emitCheckControls, router, showNotification]);

  return {
    isLoading,
    leaveRoom,
    likeParticipant,
  };
}
