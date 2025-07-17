"use client";
import { useContext } from "react";
import { NotificationContext } from "../context/notificationContext";

export default function Notification() {
  const { message, visible, type } = useContext(NotificationContext);
  if (!visible) return null;
  let bgColor = "bg-pink-600";
  if (type === "success") bgColor = "bg-green-500";
  else if (type === "error") bgColor = "bg-red-600";
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-50 transition-all`}>
      {message}
    </div>
  );
} 