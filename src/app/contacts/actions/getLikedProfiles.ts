"use server"

import { prisma } from '../../../../prisma/prismaClient';

export async function getLikedProfiles(likedProfilesAmount:number):Promise<any>{
  try {  
    // mock data, because i want to write my auth logic instead next-auth
    const email = 'ramiramiusmanov1996@gmail.com';
  
    if (!email) return null;
  
    const userProfile = await prisma.profile.findFirst({
      where: { email: email },
      include: {
        likedProfiles: { orderBy: { createdAt: "asc" } },
      },
    });
  
    const allLikedProfilesLength = userProfile?.likedProfiles.length;
  
    if (allLikedProfilesLength && allLikedProfilesLength - likedProfilesAmount <= 0) {
      return null;
    }
  
    let leftArray = null;
  
    if (allLikedProfilesLength && allLikedProfilesLength - likedProfilesAmount <= 10) {
      const endIndex = allLikedProfilesLength - likedProfilesAmount;
  
      leftArray = userProfile?.likedProfiles.slice(0, endIndex);
    }
  
    const profileWithTake = await prisma.profile.findFirst({
      where: { email },
      include: {
        likedProfiles: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  
    const likedProfiles = profileWithTake?.likedProfiles;
  
    return leftArray ?? likedProfiles;
        
    } catch (error) {
      console.log(error)
    }
}


 