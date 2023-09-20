"use server";

import { prisma } from "@/lib/prisma";

export async function likeUser(
  userId: string,
  likedUserId: string
): Promise<any> {
  try {
    const likedUser = await prisma.user.findUnique({
      where: { id: likedUserId },
    });

    if (likedUser) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          likedUsers: {
            create: [likedUser],
          },
          isOnline: false,
        },
      });

      return likedUser;
    }
  } catch (error) {
    console.error(error);
  }
}
