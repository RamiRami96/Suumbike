import { useEffect } from "react";
import { User } from "@/shared/models/user";

export function useRoomCoordination({
  isLiked,
  isExited,
  isLoading,
  likeParticipant,
  leaveRoom,
  user,
  users,
  updateUsers,
}: {
  isLiked: boolean;
  isExited: boolean;
  isLoading: boolean;
  likeParticipant: () => void;
  leaveRoom: () => void;
  user: User;
  users: User[];
  updateUsers: (user: User, currentUsers: User[]) => void;
}) {
  useEffect(() => {
    if (isLiked && !isLoading) {
      likeParticipant();
    }

    if (isExited && !isLoading) {
      leaveRoom();
    }
  }, [isLiked, isExited, isLoading, likeParticipant, leaveRoom]);

  useEffect(() => {
    if (user && users.length < 3) {
      updateUsers(user, users);
    }
  }, [user, users, updateUsers]);
}
