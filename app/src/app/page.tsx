import { getServerSession } from "next-auth";

import Main from "@/components/index/main";
import { authOptions } from "@/lib/auth";
import { getOnlineUsers } from "@/services/profile/getOnlineUsers";
import { User } from "@/models/user";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const searchedUser = searchParams ? searchParams["filter[nick]"] : null;

  const session = await getServerSession(authOptions);
  const users = await getOnlineUsers(
    (session?.user as User).tgNickname,
    searchedUser
  );

  return (
    <Main users={users} currentUserNick={(session?.user as User).tgNickname} />
  );
}
