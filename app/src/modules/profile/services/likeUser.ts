"use server";

import { prisma } from "@/shared/lib/prisma";

export async function likeUser(
  userNick: string,
  participantNick: string
): Promise<any> {
  try {
    const likedUser = await prisma.user.findUnique({
      where: { tgNickname: participantNick },
    });

    if (likedUser) {
      await prisma.user.update({
        where: { tgNickname: userNick },
        data: {
          likedUsers: {
            create: [likedUser],
          },
        },
      });

      return likedUser;
    }
  } catch (error) {
    console.error(error);
  }
}
