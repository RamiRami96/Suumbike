"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { generateHeartStyles } from "./helpers/generateHeartStyles";
import { User } from "@/models/user";
import { getUser } from "@/services/profile/getUser";
import { createRoom } from "@/services/room/createRoom";

type Props = {
  users: User[] | null;
  userNick: string;
};

export default function Main({ users, userNick }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState("");

  const [inputValue, setinputValue] = useState("");

  const createMyRoom = (nick: string) => {
    createRoom(nick).then((data) => router.push(`/room/${data.roomId}/myRoom`));
  };

  const joinRoom = (nick: string) => {
    getUser(nick).then((data) => router.push(`/room/${data.roomId}/${nick}`));
  };

  const filterRooms = (nick: string, userNick: string) => {
    if (nick === userNick) {
      setError("equal");
      return;
    }

    if (!nick) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?filter[nick]=${nick}`);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      router.refresh();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-[90vh] flex flex-col items-center justify-center relative overflow-hidden">
      <h1 className="text-center text-green-400 font-black mt-12 relative z-50 drop-shadow-[0_1.2px_1.2px_rgba(74,222,128,0.8)]">
        Tanişu<span className="text-xs md:text-sm text-pink-400 px-1">❤</span>
        Aralaşu
        <span className="text-xs md:text-sm text-pink-400 px-1">❤</span>
        Mähäbbät
        <span className="text-xs md:text-sm text-pink-400 px-1">❤</span>
      </h1>
      <div className="hearts h-[90.3dvh]">
        {Array.from({ length: 25 }, (_, index) => (
          <div
            key={index}
            className="heart"
            style={generateHeartStyles(index + 1) as React.CSSProperties}
            aria-label="Heart"
          >
            ❤
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center absolute bottom-10 z-50 w-5/6 md:w-3/6">
        <div>
          <div className="flex items-start space-x-1 md:space-x-4 w-full">
            <div>
              <input
                type="text"
                className="border-2 border-pink-500 h-12 w-36 md:w-48 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-pink-500 placeholder-pink-300 text-xs md:text-sm"
                placeholder="Enter telegram nick"
                value={inputValue}
                onChange={(e) => setinputValue(e.target.value.toLowerCase())}
              />
              <p className="h-2 text-red-400 text-xs mt-2">{error}</p>
            </div>

            <button
              onClick={() => filterRooms(inputValue, userNick)}
              className="border-2 border-pink-500 h-12 w-24 rounded-lg bg-pink-500 text-white font-bold text-xs md:text-sm"
            >
              Search
            </button>
            <button
              onClick={() => createMyRoom(userNick)}
              className="border-2 border-pink-500 h-12 w-24 rounded-lg bg-pink-500 text-white font-bold text-xs md:text-sm"
            >
              My room
            </button>
          </div>
          <div className="relative">
            <ul className="mt-2 w-full rounded-lg border-2 border-pink-400 h-80 p-4 overflow-y-auto bg-opacity-75">
              {users &&
                users.map(({ tgNickname, name }) => (
                  <li
                    className="flex items-center justify-between mt-2 animate-fade-in-element"
                    key={tgNickname}
                  >
                    <span className="font-bold text-sm text-green-500">
                      {name}'s room
                    </span>
                    <button
                      onClick={() => joinRoom(tgNickname)}
                      className="border-2 border-green-500 h-12 w-24 rounded-lg bg-green-500 text-white font-bold text-xs md:text-sm"
                    >
                      Join
                    </button>
                  </li>
                ))}
            </ul>
            {/* Blur Effect Container */}
            <div
              className="absolute inset-0 rounded-lg border-2 border-pink-400 backdrop-filter backdrop-blur-sm"
              style={{ zIndex: -1 }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}
