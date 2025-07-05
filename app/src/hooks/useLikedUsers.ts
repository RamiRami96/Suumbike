import { useState, useEffect, useRef, useCallback } from "react";
import { getLikedUsers } from "@/services/profile/getLikedUsers";
import { deleteLikedUser } from "@/services/profile/deleteLikedUser";
import type { User } from "@/models/user";

export function useLikedUsers(tgNickname: string) {
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [likedUsersAmount, setLikedUsersAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListBottom, setIsListBottom] = useState(false);
  const [notUsers, setNotUsers] = useState(false);
  const lastElement = useRef(null);

  const fetchLikedUsers = async (
    likedUsersAmount: number,
    tgNickname: string
  ) => {
    try {
      if (!likedUsersAmount && !tgNickname) return;

      const data = await getLikedUsers(likedUsersAmount, tgNickname);

      if (data) {
        setLikedUsersAmount((prev) => (prev += data.length));
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteContact = async (likedUserNick: string, userNick: string) => {
    try {
      const deletedUser = await deleteLikedUser(likedUserNick, userNick);
      if (!deletedUser) return;
      setLikedUsers((prev) =>
        prev.filter((item) => item.id !== deletedUser.id)
      );
      if (likedUsers.length === 1) setNotUsers(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isListBottom) {
          setIsLoading(true);
          const newData = await fetchLikedUsers(likedUsersAmount, tgNickname);

          if (!newData) {
            setIsListBottom(true);
            observer.disconnect();
            setIsLoading(false);
            return;
          }

          setLikedUsers((prevUsers) => [...prevUsers, ...newData]);
          setIsLoading(false);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.8 }
    );

    if (lastElement.current) {
      observer.observe(lastElement.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading, likedUsers, likedUsersAmount, tgNickname, isListBottom]);

  useEffect(() => {
    fetchLikedUsers(likedUsersAmount, tgNickname).then((data) => {
      if (data && data.length === 0) {
        setNotUsers(true);
      }

      if (data && data.length !== 0) {
        setLikedUsers((prevData) => [...prevData, ...data]);
        setNotUsers(false);
      }
    });
  }, [likedUsersAmount, tgNickname]);

  return {
    likedUsers,
    isLoading,
    notUsers,
    lastElement,
    deleteContact,
  };
}
