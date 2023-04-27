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

        const myProfile = await prisma.profile.findUnique({
          where: { id: profileId },
          include: { likedProfiles: true },
        });

        if (myProfile && likedProfile) {
          myProfile?.likedProfiles?.forEach((item) => {
            delete (item as any).profileId;
          });

          const profile = await prisma.profile.update({
            where: { id: profileId },
            data: {
              likedProfiles: {
                create: [...myProfile.likedProfiles, likedProfile],
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
