"use server"

import { prisma } from '../../../../prisma/prismaClient';


export async function deleteLikedProfile(id:string){
  'use server'
  try {
   const email = 'ramiramiusmanov1996@gmail.com';


  if (!email || !id) return null;

 const deletedProfile = await prisma.likedProfile.delete({
    where: {
      id,
    },
  });

  return deletedProfile;

  } catch (error) {
    console.log(error)
  }
}   


 