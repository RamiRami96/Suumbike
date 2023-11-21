"use server";

import { prisma } from "@/lib/prisma";
import { User } from "@/models/user";

export async function getParticipant(
  tgNickname: string
): Promise<User | null | undefined> {
  try {
    const participant = await prisma.user.findUnique({ where: { tgNickname } });

    return participant;
  } catch (error) {
    console.log(error);
  }
}
