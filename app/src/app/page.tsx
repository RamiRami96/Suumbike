import { getServerSession } from "next-auth";

import Main from "@/modules/index/components/main";
import { authOptions } from "@/shared/lib/auth";
import { User } from "@/shared/models/user";
import { getRooms } from "@/modules/room/services/getRooms";

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
