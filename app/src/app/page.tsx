import { getServerSession } from "next-auth";

import Main from "@/components/index/main";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/user";
import { getRooms } from "@/services/room/getRooms";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const searchedUser = searchParams ? searchParams["filter[nick]"] : null;

  const session = await getServerSession(authOptions);
  const tgNickname = (session?.user as User)?.tgNickname;

  const users = await getRooms(tgNickname, searchedUser);

  return <Main users={users} userNick={tgNickname} />;
}
