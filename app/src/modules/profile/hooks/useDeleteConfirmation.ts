import { useState } from "react";
import { useLikedUsers } from "./useLikedUsers";


export function useDeleteConfirmation(
  userNick: string
) {
  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState("");
    const {
      deleteContact
    } = useLikedUsers(userNick);

  const confirmDelete = (tgNickname: string) => {
    setContactToDelete(tgNickname);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setContactToDelete("");
  };

  const handleDelete = async () => {
      await deleteContact(contactToDelete, userNick);
    setShowModal(false);
    setContactToDelete("");
  };

  return {
    showModal,
    contactToDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete,
  };
}
