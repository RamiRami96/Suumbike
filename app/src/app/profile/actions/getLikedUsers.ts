"use server";

import { prisma } from "@/lib/prisma";

export async function getLikedUsers(
  likedUsersAmount: number,
  tgNickname: string
): Promise<any> {
  try {
    if (!tgNickname) return null;

    const user = await prisma.user.findFirst({
      where: { tgNickname },
      include: {
        likedUsers: { orderBy: { createdAt: "asc" } },
      },
    });

    const allLikedUsersLength = user?.likedUsers.length;

    if (allLikedUsersLength && allLikedUsersLength - likedUsersAmount <= 0) {
      return null;
    }

    let leftArray = null;

    if (allLikedUsersLength && allLikedUsersLength - likedUsersAmount <= 10) {
      const endIndex = allLikedUsersLength - likedUsersAmount;

      leftArray = user?.likedUsers.slice(0, endIndex);
    }

    const userWithTake = await prisma.user.findUnique({
      where: { tgNickname },
      include: {
        likedUsers: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const likedUsers = userWithTake?.likedUsers;


    return leftArray ?? likedUsers;
  } catch (error) {
    console.log(error);
  }
}
