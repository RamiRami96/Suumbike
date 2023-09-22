import Image from "next/image";
import { Fragment, MutableRefObject } from "react";
import { Skeleton } from "./skeleton";

import { User } from "../types/user";

type Props = {
  likedUsers: User[];
  lastElement: MutableRefObject<null>;
  isLoading: boolean;
  deleteContact: (id: string) => Promise<void>;
};

export function Contacts({
  likedUsers,
  lastElement,
  isLoading,
  deleteContact,
}: Props) {
  return (
    <div className="border border-pink-400 bg-white rounded-lg overflow-hidden min-w-[320px] ">
      <div className="flex justify-between al bg-pink-400 text-white">
        <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6 text-left font-medium text-sm md:text-md">
          Avatar
        </h6>
        <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
          Name
        </h6>
        <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
          Telegram
        </h6>
        <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 text-left font-medium text-sm md:text-md"></h6>
      </div>
      <div className="h-[45vh] md:h-[50vh] overflow-y-auto">
        {likedUsers?.length === 0 ? (
          Array.from({ length: 7 }).map((_, index) => (
            <Fragment key={index}>
              <Skeleton />
            </Fragment>
          ))
        ) : (
          <>
            {likedUsers.map(({ id, avatar, name, tgNickname }, i, array) => (
              <div
                className="flex justify-between items-center py-3 border-b border-pink-400"
                key={id}
                ref={array.length - 1 === i ? lastElement : null}
              >
                <div className="flex items-center justify-start w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6">
                  <Image
                    className="h-10 w-10 rounded-full object-cover"
                    src={"/avatars/" + avatar}
                    alt="Avatar"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-400">
                  {name}
                </p>
                <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-400 break-words">
                  @{tgNickname}
                </p>
                <button
                  className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 flex justify-center md:justify-start"
                  onClick={() => deleteContact(id)}
                >
                  <div>
                    <Image
                      src={"/icons/delete.svg"}
                      alt="delete"
                      width={16}
                      height={16}
                    />
                  </div>
                </button>
              </div>
            ))}
            {isLoading && likedUsers.length >= 10 && (
              <div className="flex justify-center items-center py-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-pink-600" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
