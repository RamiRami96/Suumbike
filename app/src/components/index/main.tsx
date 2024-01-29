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
      setError("You have entered your nick");
      return;
    }

    setError("");

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
      <h1 className="text-center from-purple-500 via-pink-600 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent font-black mt-12 relative z-50">
        Tanişu<span className="text-xs md:text-sm text-pink-600 px-1">❤</span>
        Aralaşu
        <span className="text-xs md:text-sm text-pink-600 px-1">❤</span>
        Mähäbbät
        <span className="text-xs md:text-sm text-pink-600 px-1">❤</span>
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
                className="border-2 bg-dark-purple border-pink-600 h-12 w-36 md:w-48 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-700 text-white placeholder-white text-xs md:text-sm"
                placeholder="Enter telegram nick"
                value={inputValue}
                onChange={(e) => setinputValue(e.target.value.toLowerCase())}
              />
              <p className="h-2 text-red-500 text-xs mt-2">{error}</p>
            </div>

            <button
              onClick={() => filterRooms(inputValue, userNick)}
              className="border-2 border-pink-600 h-12 w-24 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs md:text-sm"
            >
              Search
            </button>
            <button
              onClick={() => createMyRoom(userNick)}
              className="border-2 border-pink-600 h-12 w-24 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs md:text-sm"
            >
              My room
            </button>
          </div>
          <div className="relative">
            <ul className="mt-2 w-full rounded-lg border-2 border-light-purple h-80 p-4 overflow-y-auto bg-opacity-75">
              {users &&
                users.map(({ tgNickname, name }) => (
                  <li
                    className="flex items-center justify-between mt-2 animate-fade-in-element"
                    key={tgNickname}
                  >
                    <span className="font-bold text-sm text-purple-500">
                      {name}'s room
                    </span>
                    <button
                      onClick={() => joinRoom(tgNickname)}
                      className="border-2 border-light-purple hover:bg-purple-500 h-12 w-24 rounded-lg bg-light-purple text-white font-bold text-xs md:text-sm"
                    >
                      Join
                    </button>
                  </li>
                ))}
            </ul>
            {/* Blur Effect Container */}
            <div
              className="absolute inset-0 rounded-lg backdrop-filter backdrop-blur-sm "
              style={{ zIndex: -1 }}
            ></div>
            <div
              className="absolute inset-0 rounded-lg bg-black opacity-70"
              style={{ zIndex: -2 }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}
