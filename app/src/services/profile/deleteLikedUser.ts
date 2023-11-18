"use server";

import { prisma } from "@/lib/prisma";

export async function deleteLikedUser(likedUserNick: string, userNick: string) {
  try {
    if (!likedUserNick || !userNick) return null;

    const deletedUser = await prisma.likedUser.delete({
      where: {
        tgNickname: likedUserNick,
      },
    });

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
