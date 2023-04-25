import { prisma } from "../prisma/prismaClient";

export const resolvers = {
  Query: {
    profiles: () => prisma.profile.findMany(),
  },
};
