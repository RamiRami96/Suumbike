"use server";

import { Profile } from "@/app/types/profile";
import { prisma } from "../../../../prisma/prismaClient";

export async function getProfiles() {
    try {
      // mock data, because i want to write my auth logic instead next-auth
      const email = 'ramiramiusmanov1996@gmail.com';
    
      if (!email) return null;
    
      const profile = await prisma.profile.findFirst({
          where: { email },
          include: { likedProfiles: {orderBy:{createdAt:'desc'}} },
      });
    
    
        if (profile) {
          const likedProfileIds = profile.likedProfiles.map((lp) => lp.id);
    
          const excludedProfileIds = [...likedProfileIds, profile.id].filter(
            (id) => id !== null
          );
    
          const profiles = await prisma.profile.findMany({
            where: {
              NOT: {
                id: { in: excludedProfileIds },
              },
            },
          });

    
          return { profile, profiles } as unknown as {
            profile: Profile;
            profiles: Profile[];
          };
        }
    
      return null
  
    } catch (error) {
      console.log(error);
    }
  }