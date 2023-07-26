"use server";

import { prisma } from "../../../../prisma/prismaClient";

export async function likeProfile(profileId: string, likedProfileId: string):Promise<any> {
    try {
      const likedProfile = await prisma.profile.findUnique({
        where: { id: likedProfileId },
      });
  
      if (likedProfile) {
        await prisma.profile.update({
          where: { id: profileId },
          data: {
            likedProfiles: {
              create: [likedProfile],
            },
          },
        });
  
       return likedProfile
      }
    } catch (error) {
      console.error(error);
    }
  }
  