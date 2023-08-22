import { signOut } from "next-auth/react";
import Image from "next/image";
import { memo } from "react";

type Props = {
  avatar: string;
  userName?: string;
  tgNickname: string;
  deleteAccount: (tgNickname: string, avatar: string) => void;
};

export const Account = memo(function Account({
  avatar,
  userName,
  tgNickname,
  deleteAccount,
}: Props) {
  return (
    <div className="flex justify-start items-center mb-8">
      <div className="flex items-center">
        <Image
          className="rounded-full object-cover cursor-pointer w-[80px] h-[80px]"
          src={avatar ? "/avatars/" + avatar : "/icons/User.svg"}
          alt="Avatar"
          width={150}
          height={150}
        />

        <div className="flex flex-col ml-6">
          <h4 className="font-bold uppercase">{userName}</h4>
          <button
            aria-label="Delete account"
            onClick={() => deleteAccount(tgNickname, avatar)}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded mt-2"
          >
            Delete account
          </button>
          <button
            aria-label="Sign out"
            onClick={() =>
              signOut({ callbackUrl: process.env.NEXT_PUBLIC__URL })
            }
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-2 rounded mt-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
});
