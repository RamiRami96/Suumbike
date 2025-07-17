import React from "react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export function DeleteConfirmationModal({
  isOpen,
  onCancel,
  onDelete,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg relative mx-2">
        <button
          className="absolute top-3 right-3 p-2 border-none cursor-pointer "
          onClick={onCancel}
        >
          <Image
            src="/icons/close_modal.svg"
            alt="Close"
            width={24}
            height={24}
            placeholder="blur"
            blurDataURL={"/images/close_modal.png"}
          />
        </button>
        <p className="mt-8 mb-8 font-bold text-base text-pink-600">
          Are you sure you want to delete this contact?
        </p>
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 text-sm bg-gray-300 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded"
            onClick={onDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
