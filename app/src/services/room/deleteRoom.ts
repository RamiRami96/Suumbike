"use server";

import { prisma } from "@/lib/prisma";

export const deleteRoom = async (nick: string) => {
  return prisma.user.update({
    where: { tgNickname: nick },
    data: {
      roomId: null,
    },
  });
};
