"use server";

import { prisma } from "@/lib/prisma";

export const deleteRoom = async (nick: string) =>
  prisma.user.update({
    where: { tgNickname: nick },
    data: {
      roomId: null,
    },
  });
