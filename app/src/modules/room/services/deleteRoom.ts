"use server";

import { prisma } from "@/shared/lib/prisma";

export const deleteRoom = async (nick: string) => {
  return prisma.user.update({
    where: { tgNickname: nick },
    data: {
      roomId: null,
    },
  });
};
