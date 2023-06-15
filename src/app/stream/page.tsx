import Stream from "./stream";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../../prisma/prismaClient";
import { Profile } from "../types/profile";

async function likeProfile(profileId: string, likedProfileId: string) {
  "use server";
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
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  const email = session.user.email;

  async function getProfilesData(email: string) {
    if (!email) return null;

    const profile = await prisma.profile.findFirst({
      where: { email },
      include: { likedProfiles: true },
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

    return null;
  }

  const profileAndProfiles = await getProfilesData(email);

  if (
    profileAndProfiles &&
    profileAndProfiles?.profile &&
    profileAndProfiles?.profiles
  ) {
    return (
      <Stream
        profile={profileAndProfiles.profile}
        profiles={profileAndProfiles.profiles}
        likeProfile={likeProfile}
      />
    );
  }

  return null;
}
