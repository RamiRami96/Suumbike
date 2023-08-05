"use server";

import { prisma } from "@/lib/prisma";

export async function exitFromPage(userId: string): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}
