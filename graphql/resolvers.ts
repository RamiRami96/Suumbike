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
        const likedProfile = await prisma.profile.findUnique({
          where: { id: likedProfileId },
        });

        const myProfile = await prisma.profile.findUnique({
          where: { id: profileId },
        });

        if (myProfile && likedProfile) {
          const profile = await prisma.profile.update({
            where: { id: profileId },
            data: {
              likedProfiles: {
                create: [
                  ...(Array.isArray(myProfile.likedProfiles)
                    ? myProfile.likedProfiles
                    : []),
                  likedProfile,
                ],
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
