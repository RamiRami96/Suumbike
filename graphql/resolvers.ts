import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profiles: () => prisma.profile.findMany(),
    profile: (_: any, { email }: any) =>
      prisma.profile.findUnique({ where: { email } }),
  },
  Mutation: {
    likeProfile: async (_parent: any, { profileId, likedProfileId }: any) => {
      try {
        const profile = await prisma.profile.update({
          where: { id: profileId },
          data: {
            likedProfiles: {
              connect: [{ id: likedProfileId }],
            },
          },
        });

        return profile;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
