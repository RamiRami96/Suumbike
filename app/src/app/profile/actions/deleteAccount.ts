"use server";

import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export const deleteAccount = async (tgNickname: string, avatar: string) => {
  const deletePath = path.join(process.cwd(), "/public", "/avatars", avatar);
  await fs.unlink(deletePath);

  await prisma.user.delete({ where: { tgNickname } });
};
