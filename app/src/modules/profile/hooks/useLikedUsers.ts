import { useState, useEffect, useRef, useCallback } from "react";
import { getLikedUsers } from "@/modules/profile/services/getLikedUsers";
import { deleteLikedUser } from "@/modules/profile/services/deleteLikedUser";
import type { User } from "@/shared/models/user";

const INTERSECTION_OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0.8,
};

export function useLikedUsers(tgNickname: string) {
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [likedUsersAmount, setLikedUsersAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListBottom, setIsListBottom] = useState<boolean>(false);
  const [notUsers, setNotUsers] = useState<boolean>(false);
  const lastElement = useRef<HTMLDivElement | null>(null);

  const fetchLikedUsers = useCallback(async (
    currentAmount: number,
    nickname: string
  ): Promise<User[] | undefined> => {
    try {
      if (!currentAmount && !nickname) return;

      const data = await getLikedUsers(currentAmount, nickname);

      if (data) {
        setLikedUsersAmount((prev) => prev + data.length);
        return data;
      }
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  }, []);

  const deleteContact = useCallback(async (
    likedUserNick: string, 
    userNick: string
  ): Promise<void> => {
    try {
      setLikedUsers((prev) =>
        prev.filter((item) => item.tgNickname !== likedUserNick)
      );
      setLikedUsersAmount((prev) => prev - 1);
      await deleteLikedUser(likedUserNick, userNick);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }, []);

  const handleIntersection = useCallback(async (entries: IntersectionObserverEntry[]): Promise<void> => {
    const [entry] = entries;
    
    if (!entry.isIntersecting || isLoading || isListBottom) return;

    setIsLoading(true);
    const newData = await fetchLikedUsers(likedUsersAmount, tgNickname);

    if (!newData) {
      setIsListBottom(true);
      setIsLoading(false);
      return;
    }

    setLikedUsers((prevUsers) => [...prevUsers, ...newData]);
    setIsLoading(false);
  }, [fetchLikedUsers, isLoading, isListBottom, likedUsersAmount, tgNickname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersection,
      INTERSECTION_OBSERVER_OPTIONS
    );

    const currentElement = lastElement.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      const data = await fetchLikedUsers(likedUsersAmount, tgNickname);
      
      if (data && data.length === 0) {
        setNotUsers(true);
      }

      if (data && data.length !== 0) {
        setLikedUsers((prevData) => [...prevData, ...data]);
        setNotUsers(false);
      }
    };

    loadInitialData();
  }, [fetchLikedUsers, likedUsersAmount, tgNickname]);

  return {
    likedUsers,
    isLoading,
    notUsers,
    lastElement,
    deleteContact,
  };
}
