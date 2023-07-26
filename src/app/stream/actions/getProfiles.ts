"use server";

import { prisma } from "../../../../prisma/prismaClient";
import type{ Profile } from "../stream";

export async function getProfiles() {
    try {
  
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