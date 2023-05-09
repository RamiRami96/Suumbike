import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    profile: (_: any, { email }: any) =>
      prisma.profile.findFirst({
        where: { email },
        include: { likedProfiles: true },
      }),
    profiles: async (_: any, { email }: any) => {
      const currentUserProfile = await prisma.profile.findFirst({
        where: { email },
        include: { likedProfiles: true },
      });

      if (currentUserProfile) {
        const likedProfileIds = currentUserProfile.likedProfiles.map(
          (lp) => lp.id
        );

        const excludedProfileIds = [
          ...likedProfileIds,
          currentUserProfile.id,
        ].filter((id) => id !== null) as string[];

        const profiles = await prisma.profile.findMany({
          where: {
            NOT: {
              id: { in: excludedProfileIds },
            },
          },
        });

        return profiles;
      }
    },
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
