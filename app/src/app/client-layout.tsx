"use client";

import { NextAuthProvider } from "./providers";
import Header from "@/modules/layout/components/header";
import { NotificationProvider } from "@/modules/layout/context/notificationContext";
import Notification from "@/modules/layout/components/notification";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <NextAuthProvider>
      <NotificationProvider>
        <Notification />
        <Header />
        {children}
      </NotificationProvider>
    </NextAuthProvider>
  );
} 