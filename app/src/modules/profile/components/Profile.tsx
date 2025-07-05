"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { Contacts } from "@/modules/profile/components/contacts";
import { Account } from "@/modules/profile/components/account";
import { useLikedUsers } from "@/modules/profile/hooks/useLikedUsers";

import type { User } from "@/shared/models/user";

export function Profile() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const user = session.data?.user;
  const userName = (user as User)?.name;
  const userNick = (user as User)?.tgNickname;
  const avatar = (user as User)?.avatar;

   const {
      notUsers,
    } = useLikedUsers(userNick);

  return (
    <>
      <section className="flex justify-center w-full">
        <div className="flex flex-col items-center mt-14 min-w-[320px] w-full sm:w-4/6 ">
          {avatar && userName && userNick && (
            <Account
              avatar={avatar}
              userName={userName}
              userNick={userNick}
            />
          )}

          {notUsers ? (
            <div className="flex justify-center text-center mt-14">
              <h2>Not liked users :(</h2>
            </div>
          ) : (
            <Contacts
              userNick={userNick}
            />
          )}
        </div>
      </section>
    </>
  );
}
