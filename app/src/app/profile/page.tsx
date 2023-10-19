"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Contacts } from "./components/contacts";
import { Account } from "./components/account";
import { deleteAccount } from "./actions/deleteAccount";
import { deleteLikedUser } from "./actions/deleteLikedUser";
import { getLikedUsers } from "./actions/getLikedUsers";
import { User } from "../types/user";

export default function Page() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [likedUsersAmount, setLikedUsersAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListBottom, setIsListBottom] = useState(false);
  const [notUsers, setNotUsers] = useState(false);
  const lastElement = useRef(null);

  const user = session.data?.user;
  const tgNickname = (user as any)?.tgNickname;
  const avatar = (user as any)?.avatar;

  const fetchLikedUsers = async () => {
    try {
      const data = await getLikedUsers(likedUsersAmount, tgNickname);

      if (data) {
        setLikedUsersAmount((prev) => (prev += data.length));
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isListBottom) {
          setIsLoading(true);
          const newData = await fetchLikedUsers();

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
  }, [isLoading, likedUsers]);

  useEffect(() => {
    fetchLikedUsers().then((data) => {
      if (data && data.length === 0) {
        setNotUsers(true);
      }

      if (data && data.length !== 0) {
        setLikedUsers((prevData) => [...prevData, ...data]);
        setNotUsers(false);
      }
    });
  }, []);

  const deleteContact = async (id: string) => {
    try {
      const deletedUser = await deleteLikedUser(id, tgNickname);
      if (!deletedUser) return;
      setLikedUsers((prev) =>
        prev.filter((item) => item.id !== deletedUser.id)
      );
      if (likedUsers.length === 1) setNotUsers(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = useCallback(
    (tgNickname: string, avatar: string) => {
      deleteAccount(tgNickname, avatar).then(() => {
        signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL });
      });
    },
    []
  );

  return (
    <>
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center mt-14 min-w-[320px] w-full sm:w-4/6 ">
          {avatar && user?.name && tgNickname && (
            <Account
              avatar={avatar}
              userName={user.name}
              tgNickname={tgNickname}
              deleteAccount={handleDeleteAccount}
            />
          )}

          {notUsers ? (
            <div className="flex justify-center text-center mt-14">
              <h2>Not liked users :(</h2>
            </div>
          ) : (
            <Contacts
              likedUsers={likedUsers}
              lastElement={lastElement}
              isLoading={isLoading}
              deleteContact={deleteContact}
            />
          )}
        </div>
      </section>
    </>
  );
}
