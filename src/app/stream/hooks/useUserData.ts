import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@/app/types/user";

export const useUserData = (usersData: { users: User[]; user: User }) => {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const tgNickname: string | undefined = (session.data?.user as any)
    ?.tgNickname;

  const not_users: boolean = usersData?.users?.length === 0;
  const user: User | undefined = usersData?.user;

  return { tgNickname, not_users, user };
};
