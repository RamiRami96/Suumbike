"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";

type Props = {
  session: Session;
};

export default function Header({ session }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-4 py-4 shadow w-full">
      <Link href={"/"}>
        <div className="font-bold text-pink-400 uppercase tracking-widest">
          Suumbike
        </div>
      </Link>
      <ul className="flex items-center">
        <li className="mr-4 font-medium text-pink-400">
          <Link href={"/"}>Start</Link>
        </li>
        <li className="mr-4 font-medium text-pink-400">
          <Link href={"/contacts"}>Contacts</Link>
        </li>
        <li className="relative font-medium text-pink-400" ref={menuRef}>
          <Image
            onClick={toggleMenu}
            className="rounded-full object-cover cursor-pointer"
            src={session?.user?.image || "/profile.svg"}
            alt="Avatar"
            width={40}
            height={40}
          />
          {isMenuOpen && (
            <div className="absolute bottom-[-8vh] right-[0.6vh] z-50 w-24 border border-pink-600 flex flex-col p-3 rounded-2xl bg-white">
              {session?.user ? (
                <button onClick={() => signOut()}>Sign out</button>
              ) : (
                <button onClick={() => signIn()}>Sign in</button>
              )}
            </div>
          )}
        </li>
      </ul>
    </header>
  );
}
