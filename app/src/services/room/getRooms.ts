"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/models/user";

export async function getRooms(
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
          roomId: {
            not: null,
          },
        },
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          tgNickname: {
            not: currentUserNick,
          },
          roomId: {
            not: null,
          },
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
