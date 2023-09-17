"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const { data: session } = useSession();
  const user = session?.user;
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
    <header className="flex justify-between items-center px-4 py-4 shadow w-full relative z-50 bg-white">
      <Link href={"/"}>
        <Image
          src={"/icons/logo.svg"}
          alt="logo"
          width={100}
          height={22}
          priority
        />
      </Link>
      <ul className="flex items-center">
        <li className="mr-4 font-medium text-pink-400">
          <Link href={"/"}>Start</Link>
        </li>
        <li className="mr-4 font-medium text-pink-400">
          <Link href={"/profile"}>Profile</Link>
        </li>
        <li
          className="relative font-medium text-pink-400  w-[40px] h-[40px]"
          ref={menuRef}
        >
          <Image
            onClick={toggleMenu}
            className="rounded-full object-cover cursor-pointer w-full h-full"
            src={
              (user as any)?.avatar
                ? "/avatars/" + (user as any)?.avatar
                : "/icons/user.svg"
            }
            alt="Avatar"
            width={40}
            height={40}
          />
          {isMenuOpen && (
            <div className="absolute bottom-[-8vh] right-[0.6vh] z-50 w-24 border border-pink-600 flex flex-col p-3 rounded-2xl bg-white">
              {user ? (
                <button
                  onClick={() =>
                    signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL })
                  }
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/auth/signin");
                    toggleMenu();
                  }}
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </li>
      </ul>
    </header>
  );
}
