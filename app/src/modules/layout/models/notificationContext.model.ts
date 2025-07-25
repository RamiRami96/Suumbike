export type NotificationType = "success" | "error" | "info";

export type NotificationMessageKey =
  | "owner_reject"
  | "opponent_reject"
  | "owner_pass"
  | "opponent_pass"
  | "room_full"
  | "connection_success"
  | "connection_rejected";

export type NotificationContextModel = {
  message: string;
  visible: boolean;
  type: NotificationType;
  showNotification: (msg: string, type?: NotificationType) => void;
}; 