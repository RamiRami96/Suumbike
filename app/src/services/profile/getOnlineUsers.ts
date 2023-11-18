"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/models/user";

export async function getOnlineUsers(
  currentUserNick?: string,
  searchedUser?: string | null
): Promise<User[]> {
  try {
    let users;
    if (!currentUserNick) {
      users = await prisma.user.findMany({
        take: 5,
      });
    }

    if (searchedUser) {
      users = await prisma.user.findMany({
        where: {
          tgNickname: searchedUser,
          isOnline: true,
        },
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          tgNickname: {
            not: currentUserNick,
          },
          isOnline: true,
        },
        take: 5,
      });
    }

    return users as unknown as User[];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
