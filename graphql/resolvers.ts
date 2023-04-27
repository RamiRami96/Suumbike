import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profiles: () => prisma.profile.findMany(),
    profile: (_: any, { email }: any) =>
      prisma.profile.findUnique({
        where: { email },
        include: { likedProfiles: true },
      }),
  },
  Mutation: {
    likeProfile: async (_parent: any, { profileId, likedProfileId }: any) => {
      try {
        const likedProfile = await prisma.profile.findUnique({
          where: { id: likedProfileId },
        });

        if (likedProfile) {
          const profile = await prisma.profile.update({
            where: { id: profileId },
            data: {
              likedProfiles: {
                create: [likedProfile],
              },
            },
          });

          return profile;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
