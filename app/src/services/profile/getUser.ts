"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/models/user";

export async function getUser(nick: string): Promise<User> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        tgNickname: nick,
      },
    });

    if (!user) {
      throw new Error("Bu isemle qullanuçı tabılmadı");
    }

    return user as unknown as User;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
