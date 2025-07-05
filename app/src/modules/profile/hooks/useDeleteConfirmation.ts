import { useState } from "react";


export function useDeleteConfirmation() {
  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState("");


  const confirmDelete = (tgNickname: string) => {
    setContactToDelete(tgNickname);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setContactToDelete("");
  };

  const handleDelete = async () => {
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
