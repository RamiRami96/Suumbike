'use server'

import { prisma } from "../../../../prisma/prismaClient";

export async function getLikedProfile() {
    // mock data, because i want to write my auth logic instead next-auth
    const email = "ramiramiusmanov1996@gmail.com";
  
    if (!email) return null;
  
    const profile = await prisma.profile.findFirst({
      where: { email },
      include: { likedProfiles: {orderBy:{createdAt:'asc'}} },
    });
  
    if (!profile) return null
  
    const likedProfile = profile.likedProfiles[0];
  
    if (!likedProfile) return null
  
    
    return {profile, likedProfile};
  }