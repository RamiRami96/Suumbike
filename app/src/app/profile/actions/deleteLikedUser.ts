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

    const user = await prisma.user.findFirst({
      where: { tgNickname: likedUserNick },
      include: {
        likedUsers: true,
      },
    });

    if (user) {
      const updatedLikedUsers = user.likedUsers.filter(
        (likedUser) => likedUser.tgNickname !== userNick
      );

      await prisma.user.update({
        where: {
          tgNickname: likedUserNick,
        },
        data: {
          likedUsers: {
            set: updatedLikedUsers,
          },
        },
      });
    }

    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
