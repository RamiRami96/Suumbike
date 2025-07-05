import { deleteAccount } from "@/modules/profile/services/deleteAccount";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { memo, useCallback } from "react";

type Props = {
  avatar: string;
  userName: string;
  userNick: string;
};

export const Account = memo(function Account({
  avatar,
  userName,
  userNick,
}: Props) {

  const handleDeleteAccount = async (tgNickname: string, avatar: string): Promise<void> => {
    await deleteAccount(tgNickname, avatar);
    signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL });
  };

  return (
    <div className="flex justify-start items-center mb-8">
      <div className="flex items-center">
        <Image
          className="rounded-full object-cover cursor-pointer w-[132px] h-[132px] border border-pink-600"
          src={avatar ? "/avatars/" + avatar : "/icons/user.svg"}
          alt="Avatar"
          width={132}
          height={132}
          placeholder="blur"
          blurDataURL={"/icons/user.svg"}
        />

        <div className="flex flex-col ml-6">
          <h4 className="font-bold uppercase text-pink-600">{userName}</h4>
          <button
            aria-label="Delete account"
            onClick={() => handleDeleteAccount(userNick, avatar)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded mt-2"
          >
            Delete account
          </button>
          <button
            aria-label="Sign out"
            onClick={() =>
              signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL })
            }
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded mt-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
});
