"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from '../../../public/logo.svg'


type Props = {
  session:{user : {name:string, image:string}} ;
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
        <Image src={logo} alt='logo' width={100} height={22}/>
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
                <button onClick={() => console.log('Sign out')}>Sign out</button>
              ) : (
                <button onClick={() => console.log('Sign in')}>Sign in</button>
              )}
            </div>
          )}
        </li>
      </ul>
    </header>
  );
}
