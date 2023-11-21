"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

export const createRoom = async (nick: string) =>
  prisma.user.update({
    where: { tgNickname: nick },
    data: {
      roomId: uuid(),
    },
  });
