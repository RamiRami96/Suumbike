import { useEffect, useCallback } from "react";
import { User } from "@/shared/models/user";

interface UseRoomCoordinationProps {
  isLiked: boolean;
  isExited: boolean;
  isLoading: boolean;
  likeParticipant: () => void;
  leaveRoom: () => void;
  user: User;
  users: User[];
  updateUsers: (user: User, currentUsers: User[]) => void;
}

export function useRoomCoordination({
  isLiked,
  isExited,
  isLoading,
  likeParticipant,
  leaveRoom,
  user,
  users,
  updateUsers,
}: UseRoomCoordinationProps) {
  useEffect(() => {
    if (isLoading) return;

    if (isLiked) {
      likeParticipant();
    }

    if (isExited) {
      leaveRoom();
    }
  }, [isLiked, isExited, isLoading, likeParticipant, leaveRoom]);

  useEffect(() => {
    if (user && users.length < 3) {
      updateUsers(user, users);
    }
  }, [user, users, updateUsers]);
}
