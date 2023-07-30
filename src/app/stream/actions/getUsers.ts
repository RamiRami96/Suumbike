"use server";

import { User } from "@/app/types/user";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getUsers(tgNickname: string) {
  "use server";
  try {
    if (!tgNickname) return null;

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
