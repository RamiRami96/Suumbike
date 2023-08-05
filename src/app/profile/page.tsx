"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { User } from "../types/user";
import { deleteAccount } from "./actions/deleteAccount";
import { deleteLikedUser } from "./actions/deleteLikedUser";
import { getLikedUsers } from "./actions/getLikedUsers";

export default function Page() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedUsersAmount, setLikedUsersAmount] = useState(0);
  const [isListBottom, setIsListBottom] = useState(false);
  const [isNotUsers, setIsNotUsers] = useState(false);
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
        setIsNotUsers(true);
      }

      if (data && data.length !== 0) {
        setLikedUsers((prevData) => [...prevData, ...data]);
        setIsNotUsers(false);
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
      if (likedUsers.length === 1) setIsNotUsers(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = (tgNickname: string, avatar: string) => {
    deleteAccount(tgNickname, avatar).then(() => {
      signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL });
    });
  };

  return (
    <section className="flex justify-center w-full">
      <div className="flex flex-col items-center mt-14 min-w-[320px] w-full sm:w-4/6 ">
        <div className="flex justify-start items-center mb-8">
          <div className="flex items-center">
            <Image
              className="rounded-full object-cover cursor-pointer w-[80px] h-[80px]"
              src={avatar ? "/avatars/" + avatar : "/icons/User.svg"}
              alt="Avatar"
              width={150}
              height={150}
            />
            <div className="flex flex-col ml-6">
              <h4 className="font-bold uppercase">{user?.name}</h4>
              <button
                aria-label="Delete account"
                onClick={() => handleDeleteAccount(tgNickname, avatar)}
                className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded mt-2"
              >
                Delete account
              </button>
              <button
                aria-label="Sign out"
                onClick={() =>
                  signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL })
                }
                className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded mt-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
        {isNotUsers ? (
          <div className="flex justify-center text-center mt-14">
            <h2>Not liked users :(</h2>
          </div>
        ) : (
          <div className="border border-pink-400 bg-white rounded-lg overflow-hidden min-w-[320px] ">
            <div className="flex justify-between al bg-pink-400 text-white">
              <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6 text-left font-medium text-sm md:text-md">
                Avatar
              </h6>
              <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
                Name
              </h6>
              <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
                Telegram
              </h6>
              <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 text-left font-medium text-sm md:text-md"></h6>
            </div>
            <div className="h-[45vh] md:h-[50vh] overflow-y-auto">
              {likedUsers?.length === 0 ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 animate-pulse"
                  >
                    <div className="w-[60px] sm:w-[140px] md:w-[200px]pl-2 sm:pl-6">
                      <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 h-10 flex align-center">
                      <div className="w-24 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
                    </div>
                    <div className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 h-10 flex align-center">
                      <div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
                    </div>
                    <div className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 h-10 flex align-center">
                      <div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {likedUsers.map(
                    ({ id, avatar, name, tgNickname }, i, array) => (
                      <div
                        className="flex justify-between items-center py-3 border-b border-pink-400"
                        key={id}
                        ref={array.length - 1 === i ? lastElement : null}
                      >
                        <div className="flex items-center justify-start w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6">
                          <Image
                            className="h-10 w-10 rounded-full "
                            src={"/avatars/" + avatar}
                            alt="Avatar"
                            width={50}
                            height={50}
                          />
                        </div>
                        <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-400">
                          {name}
                        </p>
                        <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-400 break-words">
                          @{tgNickname}
                        </p>
                        <button
                          className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 flex justify-center md:justify-start"
                          onClick={() => deleteContact(id)}
                        >
                          <div>
                            <Image
                              src={"/icons/delete.svg"}
                              alt="delete"
                              width={16}
                              height={16}
                            />
                          </div>
                        </button>
                      </div>
                    )
                  )}
                  {isLoading && likedUsers.length >= 10 && (
                    <div className="flex justify-center items-center py-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-pink-600" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
