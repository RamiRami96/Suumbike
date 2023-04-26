import { PrismaClient } from "@prisma/client";

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
        const updatedProfile = await prisma.profile.update({
          where: { id: profileId },
          data: {
            likedProfiles: {
              connect: {
                id: likedProfileId,
              },
            },
          },
          include: {
            likedProfiles: true,
          },
        });

        return updatedProfile;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
