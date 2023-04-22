import { Prisma, PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    auth: async (_: any, __: any, { req }: { req: any }) => {
      const session = await getSession({ req });
      if (!session || !session.user) return null;
      const user = await prisma.user.findUnique({
        where: session.user.email as Prisma.UserWhereUniqueInput,
      });

      return user;
    },
    allUsers: () => prisma.user.findMany(),
    getUser: (_: any, { id }: { id: Prisma.UserWhereUniqueInput }) =>
      prisma.user.findUnique({ where: id }),
  },
  Mutation: {
    createUser: async (_: any, args: Prisma.UserUncheckedCreateInput) => {
      const newUser = await prisma.user.create({ data: args });
      return newUser;
    },
    deleteUser: async (_: any, { id }: { id: Prisma.UserWhereUniqueInput }) => {
      const deleteUser = await prisma.user.delete({ where: id });
      return deleteUser;
    },
  },
};
