"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useClickOutside } from "@/modules/shared/hooks/useClickOutside";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const { data: session } = useSession();
  const user = session?.user;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  return (
    <header className="flex justify-between items-center px-4 py-4 shadow w-full relative z-50">
      <Link href={"/"}>
        <Image
          src={"/icons/logo.svg"}
          alt="logo"
          width={40}
          height={31}
          priority
        />
      </Link>
      <ul className="flex items-center">
        <li className="mr-4 font-medium text-pink-600">
          <Link href={"/"}>Main</Link>
        </li>
        <li className="mr-4 font-medium text-pink-600">
          <Link href={"/profile"}>Profile</Link>
        </li>
        <li
          className="relative font-medium text-pink-600 w-[40px] h-[40px]"
          ref={menuRef}
        >
          <Image
            onClick={toggleMenu}
            className="rounded-full object-cover cursor-pointer w-full h-full border border-pink-400"
            src={
              (user as any)?.avatar
                ? "/avatars/" + (user as any)?.avatar
                : "/icons/user.svg"
            }
            alt="Avatar"
            width={40}
            height={40}
            placeholder="blur"
            blurDataURL={"/icons/user.svg"}
          />
          {isMenuOpen && (
            <div className="absolute bottom-[-8vh] right-[0.6vh] z-50 w-24 border border-pink-600 flex flex-col p-3 rounded-2xl bg-dark-purple">
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
                  Sign In
                </button>
              )}
            </div>
          )}
        </li>
      </ul>
    </header>
  );
}
