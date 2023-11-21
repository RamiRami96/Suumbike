"use server";

import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const signUp = async (data: FormData) => {
  const name = data.get("name") as string;
  let age = data.get("age") as string;
  const tgNickname = data.get("tgNickname") as string;
  let sex = data.get("sex") as string;
  const password = data.get("password") as string;
  const avatar = data.get("avatar") as File;

  if (!name && !age && !tgNickname && !password && !avatar) {
    return "fill all fields";
  }

  const hashed_password = await hash(password, 12);

  const format = `.${avatar.name.split(".").at(-1)}`;

  const imgName = avatar.name;

  const avatarName = "avatar-" + imgName + format;

  const savePath = path.join(process.cwd(), "/public", "/avatars", avatarName);

  try {
    const buffer = await avatar.arrayBuffer();
    await fs.writeFile(savePath, Buffer.from(buffer));
  } catch (error) {
    return "error when the avatar was downloading";
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        age: Number(age),
        tgNickname,
        avatar: avatarName,
        sex,
        password: hashed_password,
      },
    });

    return user;
  } catch (error) {
    return "user with this telegram nickname already exist";
  }
};
