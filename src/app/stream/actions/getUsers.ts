"use server";

import { User } from "@/app/types/user";
import { prisma } from "@/lib/prisma";

export async function getUsers(tgNickname: string) {
  try {
    if (!tgNickname) return null;

    await prisma.user.update({
      where: { tgNickname },
      data: { isOnline: true },
    });

    const user = await prisma.user.findFirst({
      where: { tgNickname },
      include: { likedUsers: { orderBy: { createdAt: "desc" } } },
    });

    if (user) {
      const likedUserIds = user.likedUsers.map((lp) => lp.id);

      const excludedUserIds = [...likedUserIds, user.id].filter(
        (id) => id !== null
      );

      const users = await prisma.user.findMany({
        where: {
          NOT: {
            id: { in: excludedUserIds },
          },
          isOnline: true,
        },
      });

      return { user, users } as unknown as {
        user: User;
        users: User[];
      };
    }

    return null;
  } catch (error) {
    console.log(error);
  }
}
