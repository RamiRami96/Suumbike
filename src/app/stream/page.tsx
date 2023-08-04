"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import FrontCamera from "./frontCamera";
import { Spinner } from "../../components/spinner";
import { getUsers } from "./actions/getUsers";
import { likeUser } from "./actions/likeUser";
import type { User } from "../types/user";

export default function Page() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [visitedUsers, setVisitedUsers] = useState<User[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [usersData, setUsersData] = useState<{
    user: User;
    users: User[];
  } | null>(null);

  const tgNickname = (session.data?.user as any)?.tgNickname;

  const NOT_USERS = usersData?.users?.length === 0;

  const user = usersData?.user;

  function getCandidate(users?: User[], user?: User): void {
    if (users?.length && user) {
      setIsLoading(true);

      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (users.length - visitedUsers.length === 0) {
        setCandidate(null);
        return;
      } else if (
        visitedUsers.some(
          ({ tgNickname }) => tgNickname === randomUser.tgNickname
        )
      ) {
        return getCandidate(users, user);
      }

      setCandidate(randomUser);
      setIsLoading(false);
    }

    return;
  }

  function onSmash(users?: User[], user?: User) {
    setTimeLeft(120);
    if (users) {
      return getCandidate(users, user);
    }
  }

  async function onPass(user?: User, candidate?: User | null) {
    setIsLoading(true);

    if (user && candidate) {
      try {
        await likeUser(user.id, candidate.id);
        router.push(
          `/success?name=${candidate.name}&avatar=${candidate.avatar}`
        );
      } catch (error) {
        console.log("Error while liking user:", error);
        setIsLoading(false);
      }
    }

    return;
  }

  useEffect(() => {
    if (candidate) setVisitedUsers([...visitedUsers, candidate]);
  }, [candidate]);

  useEffect(() => {
    if (!NOT_USERS) {
      getCandidate(usersData?.users, usersData?.user);
    }
  }, [usersData?.users, usersData?.user]);

  useEffect(() => {
    if (timeLeft === 0) {
      onPass(user, candidate);
    }

    if (isLoading || !candidate || NOT_USERS) return;

    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  function returnToHomePage() {
    router.push("/");
  }

  useEffect(() => {
    getUsers(tgNickname).then((data) => {
      if (data) setUsersData(data);
    });
  }, [tgNickname]);

  return (
    <section className="relative h-[90vh] flex justify-center mt-50">
      <time
        aria-live="assertive"
        className="absolute z-10 top-12 left-3 text-2xl font-bold text-pink-400 md:hidden w-8 "
      >
        {`${minute}:${second.toString().padStart(2, "0")}`}
      </time>
      <div className="absolute z-10 top-10 right-3 md:hidden">
        <FrontCamera />
      </div>
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="hidden md:block w-[55px]">
          <time className="text-2xl font-bold text-pink-400">
            {`${minute}:${second.toString().padStart(2, "0")}`}
          </time>
        </div>
        <div className="inline-flex">
          <button
            className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24"
            onClick={() => onSmash(usersData?.users, usersData?.user)}
            disabled={isLoading || !candidate || NOT_USERS}
          >
            Smash
          </button>
          <button
            className="px-4 py-2 bg-white text-pink-400 border-2 border-t-pink-400 border-b-pink-400 w-24"
            onClick={returnToHomePage}
          >
            Exit
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-r-md w-24"
            onClick={() => onPass(user, candidate)}
            disabled={isLoading || !candidate || NOT_USERS}
          >
            Pass
          </button>
        </div>
        <div className="hidden md:block">
          <FrontCamera />
        </div>
      </div>
      {candidate?.name && (
        <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
          {candidate?.name}
        </h4>
      )}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {!isLoading && candidate ? (
          <Image
            src={"/avatars/" + candidate?.avatar}
            alt="Background Image"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={candidate?.avatar}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </section>
  );
}
