"use server";

import { prisma } from "@/lib/prisma";

export async function deleteLikedUser(id: string, tgNickname: string) {
  try {
    if (!id || !tgNickname) return null;

    const deletedUser = await prisma.likedUser.delete({
      where: {
        id,
      },
    });

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
