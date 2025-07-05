"use server";

import { prisma } from "@/shared/lib/prisma";
import { User } from "@/shared/models/user";

export async function getParticipant(
  tgNickname: string
): Promise<User | null | undefined> {
  try {
    const participant = await prisma.user.findUnique({ where: { tgNickname } });

    return participant as unknown as User;
  } catch (error) {
    console.log(error);
  }
}
