import { NotificationMessageKey, NotificationType } from "../models/notificationContext.model";

export const NOTIFICATION_MESSAGES: Record<NotificationMessageKey, string> = {
  owner_reject: "You rejected your opponent",
  opponent_reject: "Your opponent rejected you",
  owner_pass: "You added your opponent to contacts",
  opponent_pass: "Your opponent added you in contacts",
  room_full: "Room is full. Please try another room.",
} as const;

export const NOTIFICATION_TYPES: Record<NotificationMessageKey, NotificationType> = {
  owner_reject: "info",
  opponent_reject: "error",
  owner_pass: "success",
  opponent_pass: "success",
  room_full: "error",
} as const;

export const DEFAULT_NOTIFICATION_TYPE = NOTIFICATION_TYPES.owner_reject;
