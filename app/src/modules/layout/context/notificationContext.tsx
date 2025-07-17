"use client";
import { createContext, useState, useCallback, ReactNode } from "react";
import { DEFAULT_NOTIFICATION_TYPE } from "../const/notificationContext.const";
import type { NotificationType, NotificationContextModel } from "../models/notificationContext.model";
import { useNotification } from "../hooks/useNotification";

export const NotificationContext = createContext<NotificationContextModel>({
  message: "",
  visible: false,
  type: DEFAULT_NOTIFICATION_TYPE,
  showNotification: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { message, visible, type, showNotification } = useNotification();

  return (
    <NotificationContext.Provider value={{ message, visible, type, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
} 