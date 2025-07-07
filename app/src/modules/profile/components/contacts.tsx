"use client";

import Image from "next/image";
import Link from "next/link";

import { Fragment, MutableRefObject } from "react";
import { Skeleton } from "./skeleton";
import { DeleteConfirmationModal } from "./deleteConfirmationModal";
import { useDeleteConfirmation } from "@/modules/profile/hooks/useDeleteConfirmation";
import type { User } from "@/shared/models/user";

type Props = {
  userNick: string;
  likedUsers: User[];
  isLoading: boolean;
  lastElement: MutableRefObject<null>;
  deleteContact: (likedUserNick: string, userNick: string) => Promise<void>;
};

export function Contacts({
  userNick,
  likedUsers,
  isLoading,
  lastElement,
  deleteContact,
}: Props) {
  const {
    showModal,
    contactToDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete,
  } = useDeleteConfirmation();

  const handleDeleteContact = async () => {
    try {
      await deleteContact(contactToDelete, userNick);
    } catch (error) {
      console.error("Failed to delete contact:", error);
    } finally {
      handleDelete();
    }
  };

  return (
    <div className="border border-pink-600  rounded-lg overflow-hidden min-w-[320px] ">
      <div className="flex justify-between al bg-pink-600 text-white">
        <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6 text-left font-medium text-sm md:text-md">
          Avatar
        </h6>
        <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
          Name
        </h6>
        <h6 className="w-[100px] sm:w-[140px] md:w-[200px] px-2 py-3 sm:px-6 text-left font-medium text-sm md:text-md">
          Nick
        </h6>
        <h6 className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 text-left font-medium text-sm md:text-md"></h6>
      </div>
      <div className="h-[45vh] md:h-[50vh] overflow-y-auto px-2 bg-[linear-gradient(180deg,_#140133f2_-29.17%,_#160229fa_91.67%)]">
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
                className="flex justify-between items-center py-3 border-b border-pink-600"
                key={id}
                ref={array.length - 1 === i ? lastElement : null}
              >
                <div className="flex items-center justify-start w-[60px] sm:w-[140px] md:w-[200px] py-3 pl-2 sm:pl-6">
                  <Link href={`profile/${id}`}>
                    <Image
                      className="h-10 w-10 rounded-full object-cover"
                      src={"/avatars/" + avatar}
                      alt="Avatar"
                      width={50}
                      height={50}
                      placeholder="blur"
                      blurDataURL={"/icons/user.svg"}
                    />
                  </Link>
                </div>
                <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-600">
                  {name}
                </p>
                <p className="w-[100px] sm:w-[140px] md:w-[200px]  py-3 px-2 sm:px-6 text-left text-xs md:text-sm text-pink-600 break-words">
                  @{tgNickname}
                </p>
                <div className="w-[60px] sm:w-[140px] md:w-[200px] py-3 pr-4 sm:pr-6 flex justify-center md:justify-start">
                  <button
                    className="ml-2"
                    onClick={() => confirmDelete(tgNickname)}
                  >
                    <div>
                      <Image
                        src={"/icons/delete.svg"}
                        alt="delete"
                        width={16}
                        height={16}
                        placeholder="blur"
                        blurDataURL={"/icons/delete.svg"}
                      />
                    </div>
                  </button>
                </div>
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
      <DeleteConfirmationModal
        isOpen={showModal}
        onCancel={handleCancelDelete}
        onDelete={handleDeleteContact}
      />
    </div>
  );
}
