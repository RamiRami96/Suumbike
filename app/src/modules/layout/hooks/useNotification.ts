import { useState, useCallback } from "react";
import { DEFAULT_NOTIFICATION_TYPE } from "../const/notificationContext.const";
import type { NotificationType } from "../models/notificationContext.model";

export function useNotification() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<NotificationType>(DEFAULT_NOTIFICATION_TYPE);

  const showNotification = useCallback((msg: string, type: NotificationType = DEFAULT_NOTIFICATION_TYPE) => {
    setMessage(msg);
    setType(type);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  }, []);

  return { message, visible, type, showNotification };
} 