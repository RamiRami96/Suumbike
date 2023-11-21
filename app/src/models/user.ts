export type User = {
  [key: number]: any;
  id: string;
  age: number;
  name: string;
  tgNickname: string;
  avatar: string;
  roomId?: string;
  likedUsers: User[];
};
