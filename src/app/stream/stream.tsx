"use client";

import FrontCamera from "./frontCamera";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../components/spinner";

export type Profile = {
  [key: number]: any;
  id: string;
  name: string;
  email: string;
  avatar: string;
  likedProfiles: Profile[];
};

type Props = {
  profile: Profile;
  profiles: Profile[];
  likeProfile: (profileId: string, likedProfileId: string) => void;
};

export default function Stream({ profile, profiles, likeProfile }: Props) {
  const router = useRouter();

  const [candidate, setCandidate] = useState<Profile | null>(null);
  const [visitedUsers, setVisitedUsers] = useState<Profile[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  const NOT_USERS = profiles?.length === 0;

  const PROFILE_ID = profile?.id;
  const CANDIDATE_ID = candidate?.id;

  function getCandidate(users?: Profile[], user?: Profile): void {
    if (users?.length && user) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (users.length - visitedUsers.length === 0) {
        setCandidate(null);
        return;
      } else if (visitedUsers.some(({ email }) => email === randomUser.email)) {
        return getCandidate(users, user);
      }

      setCandidate(randomUser);
    }

    return;
  }

  function onSmash(users?: Profile[], user?: Profile) {
    setTimeLeft(120);
    if (users) {
      return getCandidate(users, user);
    }
  }

  function onPass(profileId?: string, likedProfileId?: string) {
    if (profileId && likedProfileId) {
      likeProfile(profileId, likedProfileId);
      router.push("/success");
    }

    return;
  }

  useEffect(() => {
    if (candidate) setVisitedUsers([...visitedUsers, candidate]);
  }, [candidate]);

  useEffect(() => {
    if (!NOT_USERS) {
      getCandidate(profiles, profile);
    }
  }, [profiles]);

  useEffect(() => {
    if (timeLeft === 0) {
      return onPass(PROFILE_ID, CANDIDATE_ID);
    }

    if (!candidate || NOT_USERS) return;

    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(intervalId);
  });

  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;

  function returnToHomePage() {
    router.push("/");
  }

  return (
    <div className="relative h-[90vh] flex justify-center mt-50">
      <time className="absolute z-10 top-12 left-3 text-2xl font-bold text-pink-400 md:hidden w-8 ">
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
            onClick={() => onSmash(profiles, profile)}
            disabled={!candidate || NOT_USERS}
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
            onClick={() => onPass(PROFILE_ID, CANDIDATE_ID)}
            disabled={!candidate || NOT_USERS}
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
        {candidate ? (
          <Image
            src={candidate?.avatar}
            alt="Background Image"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
